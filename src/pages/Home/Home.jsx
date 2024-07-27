import { useEffect, useState } from "react";
import Header from "../../components/Header";
import axios from "axios";
import { Link } from "react-router-dom";
import DatesForm from "../Home/DatesForm";
import Footer from "../../components/Footer";
import PageWrapper from "../../components/PageWrapper";

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
      <PageWrapper>
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
                  <div className="my-6 p-4 md:grid md:grid-cols-5 hover:border-blue-950 hover:border-2 md:border-gray-700 border-2 rounded-xl">
                    <div className="md:col-span-1">
                      <Link to={`/hotel/${acc._id}`}>
                        <img
                          src="https://images.unsplash.com/photo-1472289065668-ce650ac443d2?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                          // src={`http://localhost:3000/uploads/${acc.photos[0]}`}
                          // src={`https://gotripapi.onrender.com/uploads/${acc.photos[0]}`}
                          alt=""
                          className="md:w-[15rem] md:h-[18rem] rounded-lg"
                        />
                      </Link>
                    </div>
                    <div className="md:col-span-3 md:flex md:flex-col md:justify-around">
                      <div className="mt-2">
                        <Link to={`/hotel/${acc._id}`}>
                          <p className="text-xl font-semibold">{acc.title}</p>
                          <p>{acc.location}</p>
                        </Link>
                      </div>
                      <div className="hidden md:block">
                        <p>Shit offer 1</p>
                        <p>Shit offer 2</p>
                        <p>Shit offer 3</p>
                      </div>
                    </div>
                    <div className="mt-2 md:border-gray-700 md:border-l md:col-span-1 md:text-center">
                      <p>Starting from $90</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </PageWrapper>
      <Footer />
    </>
  );
};

export default Home;
