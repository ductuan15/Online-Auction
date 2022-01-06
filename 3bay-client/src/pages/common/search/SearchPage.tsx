import {
  Box,
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
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useCategoryContext } from '../../../contexts/admin/CategoryContext'
import Product from '../../../models/product'
import {
  searchProduct,
  SORT_BY,
  SORT_TYPE,
} from '../../../services/product.service'
import ProductList from '../product-list/ProductList'
import { renderCategorySelection } from '../../../components/common/form/CategoryChooser'
import ProductCardSkeleton from '../../../components/common/product/ProductCardSkeleton'

const SearchPage = (): JSX.Element => {
  const [searchParams, setSearchParams] = useSearchParams()

  const params = useMemo(() => {
    return {
      key: searchParams.get('key') || '',
      page: +(searchParams.get('page') || 1),
      categoryId: searchParams.get('categoryId') || '',
      sortBy:
        searchParams.get('sortBy') === SORT_BY.currentPrice
          ? SORT_BY.currentPrice
          : SORT_BY.closeTime,
      sortType:
        searchParams.get('sortType') === SORT_TYPE.asc
          ? SORT_TYPE.asc
          : SORT_TYPE.desc,
    }
  }, [searchParams])

  const [hasNextPage, setHasNextPage] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { state } = useCategoryContext()
  const { allCategories } = state

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await searchProduct(
        params.key,
        params.page,
        params.categoryId,
        params.sortBy as keyof typeof SORT_BY,
        params.sortType as keyof typeof SORT_TYPE,
      )
      setHasNextPage(res.data.hasNextPage)
      setProducts([...res.data.items])
    } finally {
      // set is error
      setIsLoading(false)
    }
  }, [
    params.key,
    params.page,
    params.categoryId,
    params.sortBy,
    params.sortType,
  ])

  useEffect(() => {
    ;(async () => {
      await fetchData()
    })()
  }, [fetchData])

  const handlePriceSortChange = (event: SelectChangeEvent) => {
    const [sortBy, sortType] = event.target.value.split('-')
    setSearchParams({
      ...Object.fromEntries(new URLSearchParams(searchParams)),
      sortBy: sortBy,
      sortType: sortType,
    })
  }

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setSearchParams({
      ...Object.fromEntries(new URLSearchParams(searchParams)),
      page: '1',
      categoryId: event.target.value || '',
    })
  }

  const handlePageChange = (
    event: ChangeEvent<unknown>,
    pageNumber: number,
  ) => {
    setSearchParams({
      ...Object.fromEntries(new URLSearchParams(searchParams)),
      page: `${pageNumber}`,
    })
  }

  return (
    <Grid sx={{ m: 5 }}>
      <FormControl sx={{ minWidth: 240, mr: 4 }}>
        <InputLabel id='sort-price-label'>Sort</InputLabel>

        <Select
          labelId='sort-price-label'
          id='demo-simple-select'
          value={`${params.sortBy}-${params.sortType}`}
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
          value={params.categoryId + ''}
          label='Category'
          onChange={handleCategoryChange}
        >
          <MenuItem value=''>
            <em>None</em>
          </MenuItem>

          {renderCategorySelection(allCategories)}
        </Select>
      </FormControl>

      <Box sx={{ my: 4 }} minHeight={400}>
        <Typography
          color='text.primary'
          variant='h4'
          fontWeight={600}
          gutterBottom
        >
          {`Search result ${params.key ? `for 「${params.key}」` : ''}`}
        </Typography>

        {(() => {
          if (isLoading) {
            return (
              <Grid container justifyContent='center' spacing={2}>
                {/*<CircularProgress color='secondary' />*/}
                {[1, 2, 3, 4].map((i) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                    <ProductCardSkeleton />
                  </Grid>
                ))}
              </Grid>
            )
          } else if (products.length === 0) {
            return (
              <Typography
                color='text.primary'
                variant='h4'
                fontWeight={600}
                textAlign='center'
                gutterBottom
              >
                Empty results :(
              </Typography>
            )
          } else {
            return (
              <>
                <ProductList items={products} />

                <Grid container justifyContent='center' sx={{ mt: 2 }}>
                  <Pagination
                    page={params.page}
                    count={params.page + (hasNextPage ? 1 : 0)}
                    onChange={handlePageChange}
                    renderItem={(item) => {
                      if (
                        item.page === params.page + (hasNextPage ? 1 : 0) &&
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
