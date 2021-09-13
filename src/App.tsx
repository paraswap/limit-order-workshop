import { Web3Provider } from '@ethersproject/providers'
import { Web3ReactProvider } from '@web3-react/core'
import Main from './components/Main'
import { StylesProvider } from '@material-ui/core/styles'

function getLibrary(provider: any): Web3Provider {
    return new Web3Provider(provider)
}

export default function App() {
    return (
        <Web3ReactProvider getLibrary={getLibrary}>
            <StylesProvider injectFirst>
                <Main />
            </StylesProvider>
        </Web3ReactProvider>
    )
}
