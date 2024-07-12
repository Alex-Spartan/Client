import { useEffect, useState } from "react";
import Header from "../components/Header";
import axios from "axios";
import { Link } from "react-router-dom";
import DatesForm from "../components/DatesForm";
import Footer from "../components/Footer";

const Home = () => {
  const [accomodation, setAccomodation] = useState([]);
  useEffect(() => {
    const fetchAccomodation = async () => {
      const response = await axios.get("/places/accomodation");
      setAccomodation(response.data);
    };
    fetchAccomodation();
  }, [setAccomodation]);

  return (
    <>
      <Header />
      <div className="py-4 px-5 p-2 md:py-4 md:px-16">
        <DatesForm />
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Top hotels</h1>
          <p className="text-lg">The best locations are here</p>
        </div>
        <div>
          {accomodation &&
            accomodation.map((acc) => (
              <div key={acc._id}>
                <div>
                  <div className="my-6 p-4 md:grid md:grid-cols-5 hover:border-blue-950 hover:border-2 md:border-gray-700 md:border md:rounded-xl">
                    <div className="col-span-1">
                      <Link to={`/hotel/${acc._id}`}>
                        <img
                          src={`http://localhost:3000/uploads/${acc.photos[0]}`}
                          alt=""
                          className="md:w-[15rem] md:h-[18rem] rounded-lg"
                        />
                      </Link>
                    </div>
                    <div className="md:col-span-3 md:flex md:flex-col md:justify-around">
                      <div>
                        <Link to={`/hotel/${acc._id}`}>
                          <p className="text-xl font-semibold">{acc.title}</p>
                          <p>{acc.location}</p>
                        </Link>
                      </div>
                      <div>
                        <p>Shit offer 1</p>
                        <p>Shit offer 2</p>
                        <p>Shit offer 3</p>
                      </div>
                    </div>
                    <div className="md:border-gray-700 md:border-l md:col-span-1 text-center">
                      <p>Prices goes here</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
