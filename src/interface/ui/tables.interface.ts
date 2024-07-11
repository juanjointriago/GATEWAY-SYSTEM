import { ReactElement, ReactNode } from "react"

export interface ColumnProps<T>{
    title: string
    key: string
    render?: (column:ColumnProps<T>, item:T ) => ReactElement | ReactNode
}