import {
  Box,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  ListSubheader,
  MenuItem,
  Pagination,
  PaginationItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useCategoryContext } from '../../../contexts/admin/CategoryContext'
import Product from '../../../models/product'
import {
  searchProduct,
  SORT_BY,
  SORT_TYPE,
} from '../../../services/product.service'
import ProductList from '../product-list/ProductList'
import { renderCategorySelection } from '../../../components/common/form/CategoryChooser'

const SearchPage = (): JSX.Element => {
  const [searchParams, setSearchParams] = useSearchParams()
  const key = searchParams.get('key') || ''
  const page = +(searchParams.get('page') || 1)
  const [categoryId, setCategoryId] = useState(
    searchParams.get('categoryId') || '',
  )
  const [sortBy, setSortBy] = useState(
    searchParams.get('sortBy') === SORT_BY.currentPrice
      ? SORT_BY.currentPrice
      : SORT_BY.closeTime,
  )
  const [sortType, setSortType] = useState(
    searchParams.get('sortType') === SORT_TYPE.asc
      ? SORT_TYPE.asc
      : SORT_TYPE.desc,
  )
  const [hasNextPage, setHasNextPage] = useState(false)
  const [currentPage, setCurrentPage] = useState(page)
  const [isNeedRedirect, setIsNeedRedirect] = useState(false)
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { state } = useCategoryContext()
  const { allCategories } = state

  useEffect(() => {
    const newCategoryId = searchParams.get('categoryId')
    if (newCategoryId && newCategoryId !== categoryId) {
      setCategoryId(newCategoryId)
    }
  }, [categoryId, searchParams])

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await searchProduct(
        key,
        currentPage,
        categoryId,
        sortBy as keyof typeof SORT_BY,
        sortType as keyof typeof SORT_TYPE,
      )
      setHasNextPage(res.data.hasNextPage)
      setProducts([...res.data.items])
      console.log(res.data.hasNextPage)
      //test is loading
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    } catch (e) {
      // set is error
      setIsLoading(false)
    }
  }, [key, currentPage, categoryId, sortBy, sortType])

  useEffect(() => {
    if (isNeedRedirect) {
      searchParams.set('categoryId', categoryId)
      searchParams.set('sortBy', sortBy)
      searchParams.set('sortType', sortType)
      searchParams.set('key', key)
      searchParams.set('page', currentPage + '')
      setSearchParams({
        ...searchParams,
      })
      navigate(`/products/search/?${searchParams.toString()}`)
      setIsNeedRedirect(false)
    }
  }, [isNeedRedirect])

  useEffect(() => {
    setIsNeedRedirect(true)
    ;(async () => {
      await fetchData()
    })()
  }, [currentPage, sortBy, sortType, categoryId])
  const handlePriceSortChange = (event: SelectChangeEvent) => {
    const [sortBy, sortType] = event.target.value.split('-')
    setSortBy(sortBy)
    setSortType(sortType)
  }
  const handleCategoryChange = (event: SelectChangeEvent) => {
    searchParams.set('categoryId', event.target.value)
    setCurrentPage(1)
    setCategoryId(event.target.value || '')
  }

  const handlePageChange = (
    event: ChangeEvent<unknown>,
    pageNumber: number,
  ) => {
    setCurrentPage(pageNumber)
  }

  return (
    <Grid sx={{ m: 5 }}>
      <FormControl sx={{ minWidth: 240, mr: 4 }}>
        <InputLabel id='sort-price-label'>Sort</InputLabel>
        <Select
          labelId='sort-price-label'
          id='demo-simple-select'
          value={`${sortBy}-${sortType}`}
          label='Price'
          onChange={handlePriceSortChange}
        >
          <ListSubheader>Close time</ListSubheader>
          <MenuItem value={`${SORT_BY.closeTime}-${SORT_TYPE.desc}`}>
            Close time: ↓
          </MenuItem>
          <MenuItem value={`${SORT_BY.closeTime}-${SORT_TYPE.asc}`}>
            Close time: ↑
          </MenuItem>
          <ListSubheader>Price</ListSubheader>
          <MenuItem value={`${SORT_BY.currentPrice}-${SORT_TYPE.desc}`}>
            Price: ↓
          </MenuItem>
          <MenuItem value={`${SORT_BY.currentPrice}-${SORT_TYPE.asc}`}>
            Price: ↑
          </MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ minWidth: 240 }}>
        <InputLabel id='category-select-label'>Category</InputLabel>
        <Select
          labelId='category-select-label'
          id='category-select'
          value={categoryId + ''}
          label='Category'
          onChange={handleCategoryChange}
        >
          <MenuItem value=''>
            <em>None</em>
          </MenuItem>
          {renderCategorySelection(allCategories)}
        </Select>
      </FormControl>
      <Box sx={{ my: 4 }}>
        {(() => {
          if (isLoading) {
            return (
              <Grid container justifyContent='center'>
                <CircularProgress color='secondary' />
              </Grid>
            )
          } else if (products.length === 0) {
            return (
              <Typography
                color='text.primary'
                variant='h4'
                fontWeight={600}
                gutterBottom
              >
                {`No result for ${key}`}
              </Typography>
            )
          } else {
            return (
              <>
                <ProductList items={products} />
                <Grid container justifyContent='center'>
                  <Pagination
                    page={currentPage}
                    count={currentPage + (hasNextPage ? 1 : 0)}
                    onChange={handlePageChange}
                    renderItem={(item) => {
                      if (
                        item.page === currentPage + (hasNextPage ? 1 : 0) &&
                        item.type === 'page' &&
                        hasNextPage
                      ) {
                        return <PaginationItem type='end-ellipsis' disabled />
                      }
                      return <PaginationItem {...item} />
                    }}
                  />
                </Grid>
              </>
            )
          }
        })()}
      </Box>
    </Grid>
  )
}

export default SearchPage
