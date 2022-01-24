import {
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
  TypographyStyle,
} from '@mui/material'
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useCategoryContext } from '../../../contexts/layout/CategoryContext'
import Product from '../../../models/product'
import {
  searchProduct,
  SORT_BY,
  SORT_TYPE,
} from '../../../services/product.service'
import { renderCategorySelection } from '../../../components/common/form/CategoryChooser'
import ProductListLayout from '../../../components/common/product-list/ProductListLayout'
import { useLayoutContext } from '../../../contexts/layout/LayoutContext'

const titleStyle: TypographyStyle = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
}

type TimeSelectProp = {
  params: { sortBy: string; sortType: string }
  handlePriceSortChange: (e: SelectChangeEvent) => void
}

type SortByCategoryProp = {
  params: { categoryId: string }
  handleCategoryChange: (e: SelectChangeEvent) => void
}

const SortByTimeSelect = ({
  params,
  handlePriceSortChange,
}: TimeSelectProp): JSX.Element => {
  return (
    <FormControl sx={{ minWidth: 240 }}>
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
  )
}

const SortByCategorySelect = ({
  params,
  handleCategoryChange,
}: SortByCategoryProp): JSX.Element => {
  const {
    state: { allCategories },
  } = useCategoryContext()

  const categories = useMemo(() => {
    return renderCategorySelection(allCategories, true)
  }, [allCategories])

  return (
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

        {categories}
      </Select>
    </FormControl>
  )
}

const SearchPage = (): JSX.Element => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { state: layoutState, dispatch: layoutDispatch } = useLayoutContext()

  const params = useMemo(() => {
    layoutDispatch({ type: 'LOAD_SEARCH_RESULT' })
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
  }, [layoutDispatch, searchParams])

  const [hasNextPage, setHasNextPage] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      window.scrollTo(0, 0)
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
      if (layoutState.shouldLoadingSearchResult) {
        await fetchData()
        layoutDispatch({ type: 'DONE_LOADING_SEARCH_RESULTS' })
      }
    })()
  }, [fetchData, layoutDispatch, layoutState.shouldLoadingSearchResult])

  const handlePriceSortChange = useCallback(
    (event: SelectChangeEvent) => {
      const [sortBy, sortType] = event.target.value.split('-')
      setSearchParams({
        ...Object.fromEntries(new URLSearchParams(searchParams)),
        sortBy: sortBy,
        sortType: sortType,
      })
    },
    [searchParams, setSearchParams],
  )

  const handleCategoryChange = useCallback(
    (event: SelectChangeEvent) => {
      setSearchParams({
        ...Object.fromEntries(new URLSearchParams(searchParams)),
        page: '1',
        categoryId: event.target.value || '',
      })
    },
    [searchParams, setSearchParams],
  )

  const handlePageChange = useCallback(
    (event: ChangeEvent<unknown>, pageNumber: number) => {
      setSearchParams({
        ...Object.fromEntries(new URLSearchParams(searchParams)),
        page: `${pageNumber}`,
      })
    },
    [searchParams, setSearchParams],
  )

  return (
    <Grid container spacing={2} flexDirection='column' sx={{ my: 1 }}>
      <Grid
        container
        item
        xs={12}
        component={Grid}
        display='flex'
        direction='row'
        columnSpacing={2}
        rowSpacing={2}
      >
        <Grid item xs={'auto'}>
          <SortByTimeSelect
            params={params}
            handlePriceSortChange={handlePriceSortChange}
          />
        </Grid>

        <Grid item xs={'auto'}>
          <SortByCategorySelect
            params={params}
            handleCategoryChange={handleCategoryChange}
          />
        </Grid>
      </Grid>

      <ProductListLayout
        items={products}
        isLoading={isLoading}
        titleComponent={
          <Typography
            color='text.primary'
            variant='h4'
            fontWeight={600}
            sx={titleStyle}
          >
            {`Search result ${params.key ? `for 「${params.key}」` : ''}`}
          </Typography>
        }
      />

      {products.length !== 0 && (
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
      )}
    </Grid>
  )
}

export default SearchPage
