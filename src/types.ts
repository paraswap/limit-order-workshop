export interface Token {
    name: string
    address: string
    symbol: string
    decimals: number
    chainId: number
    logoURI: string
}

export interface TokensList {
    name: string
    logoURI: string
    tokens: Token[]
}
