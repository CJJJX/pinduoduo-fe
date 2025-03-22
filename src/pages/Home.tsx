import nwuBuilding from '../src/assets/nwu_building.jfif';
import nwuLogo from '../src/assets/nwu_logo.png';
export default function Home() {
    return (
        <>
        <img src={nwuBuilding} style={{width: '100vw'}}></img>
        <img src={nwuLogo} style={{width: '30vw'}}></img>
        
        </>
    )
}