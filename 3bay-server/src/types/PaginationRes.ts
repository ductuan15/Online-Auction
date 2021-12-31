export interface PaginationRes<T> {
    items: T[],
    hasNextPage: boolean,
    cursor?:number | string
}