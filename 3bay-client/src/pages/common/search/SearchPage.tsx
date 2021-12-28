import { usePagination } from '@mui/lab'
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Pagination,
  PaginationItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import HomeLayout from '../../../components/common/layout/HomeLayout'
import Product from '../../../models/product'
import { searchProduct, SORT_TYPE } from '../../../services/product.service'
import ProductList from '../productList/ProductList'

const SearchPage = (): JSX.Element => {
  const [pageCount, setPageCount] = useState(3)
  const [products, setProducts] = useState<Product[]>([])
  const [priceSort, setPriceSort] = useState(SORT_TYPE.DESC)
  const [closeTimeSort, setCloseTimeSort] = useState(SORT_TYPE.DESC)
  const { items } = usePagination({
    count: pageCount,
  })

  console.log(items)

  const fetchData = useCallback(
    async (key: string, page: number) => {
      const res = await searchProduct(
        key,
        page,
        priceSort as keyof typeof SORT_TYPE,
        closeTimeSort as keyof typeof SORT_TYPE,
      )
      console.log(res)
      setProducts([...res.data])
    },
    [closeTimeSort, priceSort],
  )

  const handlePriceSortChange = (event: SelectChangeEvent) => {
    setPriceSort(event.target.value)
  }
  const handleCloseTimeSortChange = (event: SelectChangeEvent) => {
    setCloseTimeSort(event.target.value)
  }
  // useEffect(() => {
  //   fetchData('samsung', 1)
  // }, [])

  useEffect(() => {
    ;(async () => {
      await fetchData('samsung', 1)
    })()
  }, [closeTimeSort, fetchData, priceSort])

  const handlePageChange = (
    event: ChangeEvent<unknown>,
    pageNumber: number,
  ) => {
    setPageCount(pageNumber + 1)
  }
  return (
    <HomeLayout>
      <Typography>Sort by</Typography>
      <FormControl sx={{ minWidth: 240 }}>
        <InputLabel id='sort-price-label'>Price</InputLabel>
        <Select
          labelId='sort-price-label'
          id='demo-simple-select'
          value={priceSort}
          label='Price'
          onChange={handlePriceSortChange}
        >
          <MenuItem disabled value=''>
            Price
          </MenuItem>
          <MenuItem value={SORT_TYPE.DESC}>High to Low</MenuItem>
          <MenuItem value={SORT_TYPE.ASC}>Low to high</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ minWidth: 240 }}>
        <InputLabel id='sort-close-time-label'>Close time</InputLabel>
        <Select
          labelId='sort-close-time-label'
          id='sort-close-time-select'
          value={closeTimeSort}
          label='Close time'
          onChange={handleCloseTimeSortChange}
        >
          <MenuItem disabled value=''>
            Close time
          </MenuItem>
          <MenuItem value={SORT_TYPE.DESC}>High to Low</MenuItem>
          <MenuItem value={SORT_TYPE.ASC}>Low to high</MenuItem>
        </Select>
      </FormControl>
      {/* <FormControl sx={{ minWidth: 240 }}>
        <InputLabel id='sort-price-label'>Price</InputLabel>
        <Select
          labelId='sort-price-label'
          id='demo-simple-select'
          value={''}
          label='Age'
          // onChange={handleChange}
        >
          <MenuItem disabled value=''>
            Price
          </MenuItem>
          <MenuItem value={'des'}>High to Low</MenuItem>
          <MenuItem value={'asc'}>Low to high</MenuItem>
        </Select>
      </FormControl> */}
      <ProductList items={products} />
      <Grid container justifyContent='center'>
        <Pagination
          count={pageCount}
          onChange={handlePageChange}
          renderItem={(item) => {
            if (item.page === pageCount && item.type === 'page') {
              return <PaginationItem type='end-ellipsis' disabled />
            }
            return <PaginationItem {...item} />
          }}
        />
      </Grid>
    </HomeLayout>
  )
}

export default SearchPage
