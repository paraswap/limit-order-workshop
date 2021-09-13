import ConnectAccount from './ConnectAccount'
import LimitOrder from './LimitOrder'
import OrderHistory from './OrderHistory'
import styled from 'styled-components'
import { Paper } from '@material-ui/core'
import { useWeb3React } from '@web3-react/core'
import paraswapLogo from '../paraswapLogo.png'
import gelatoLogo from '../gelatoLogo.png'

const MainCtn = styled.div``
const Header = styled.div`
    display: flex;
    justify-content: flex-end;
    margin: 10px 10px 0 0;
`
const Body = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`
const TitleCtn = styled(Paper)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 400px;
    padding: 10px 30px;

    & > h1,
    h2 {
        line-height: 0;
    }

    & > h1 {
        font-size: 2em;
    }

    & > h2 {
        font-size: 0.9em;
    }
`
const LimitOrderCtn = styled(Paper)`
    width: 400px;
    height: 300px;
    display: flex;
    justify-content: center;
    margin-top: 20px;
    padding: 20px 30px;
    background: white;
`
const OrderHistoryCtn = styled(Paper)`
    width: 400px;
    height: 100px;
    margin-top: 20px;
    padding: 20px 30px;
    background: white;
`

export default function Main() {
    const { account } = useWeb3React()
    return (
        <MainCtn>
            <Header>
                <ConnectAccount />
            </Header>
            <Body>
                <TitleCtn elevation={3}>
                    <h1>Limit Order App</h1>
                    <h2>
                        Powered by <img src={paraswapLogo} height={20} alt="" />{' '}
                        x <img src={gelatoLogo} height={20} alt="" />
                    </h2>
                </TitleCtn>
                <LimitOrderCtn elevation={3}>
                    <LimitOrder />
                </LimitOrderCtn>
                {account && (
                    <OrderHistoryCtn elevation={3}>
                        <OrderHistory />
                    </OrderHistoryCtn>
                )}
            </Body>
        </MainCtn>
    )
}
