import {Link} from "react-router-dom"
import DcsLogo from "../elements/DcsLogo";

const NotFoundPage = () => {

    return (
        <div className="dcs-container gap-20 py-35">
            <div>
                <DcsLogo label="404" size="lg" />
            </div>

            <div className='grid gap-3 p-6 text-center mt-30'>
              <p className='m-0'>Pagina non trovata.</p>
              <Link to='/' className='underline'>Torna alla home</Link>
            </div>
        </div>
    );
};
export default NotFoundPage;