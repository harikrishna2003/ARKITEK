import Sidebar from "../Components/Sidebar";
import Agency from "../Components/Details/Agency";
import Client from "../Components/Details/Client";
// import Navbar from "../Components/Details/Navbar";

function Details() {
    return (
       
            <div className="flex-1 flex flex-col space-y-10">
                {/* <Navbar /> */}
                <Client />
                <Agency />
                
            </div>
        

    )
}
export default Details;