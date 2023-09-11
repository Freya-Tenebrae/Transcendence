import home from './fonts/home.svg';
import homeBeat from './fonts/home_beat.svg';
import './Home.css'

function Home() {
	return (
		<div className='Home'>
			<img src={home} className="Home-logo" alt="home-logo-beat" />
			
		</div>
	);
}

export default Home;