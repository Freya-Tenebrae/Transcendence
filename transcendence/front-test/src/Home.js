import home from './fonts/home.svg';
import homeBeat from './fonts/home_beat.svg';
import './Home.css'

function Home() {
	return (
		<div className='Home'>
			<a href="index.html"><img src={home} className="Home-logo" alt="home-logo-beat" /> </a>
		</div>
	);
}

export default Home;

// function Header() {
	// const [isActive, setIsActive] = useState(false);
	// const [isActive2, setIsActive2] = useState(false);
	// return (
		// <div>
	   {/* </div> */}
	// )
// }

// (à remplacer par une fonction Header, qui va comprendre tus les icônes en-tête plus tard)