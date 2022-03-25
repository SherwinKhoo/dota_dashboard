import React, { useEffect, useState } from "react";
import ICONS from "../images/icon/index.js";
import GREYSCALE from "../images/greyscale/index.js";
import InvokerSpinner from "../spinner/LoadingSpinner";
import statsStats from "../json/heroStats.json";

const HeroContainer = () => {
  // contents of input box
  const [heroSelection, setHeroSelection] = useState("");

  // all 124 heroes
  const [heroStats, setHeroStats] = useState([]);
  // loading and error handling when fetching hero data
  const [heroStatsIsLoading, setHeroStatsIsLoading] = useState("");
  const [heroStatsError, setHeroStatsError] = useState(null);

  const [heroID, setHeroID] = useState(``);
  const [heroName, setHeroName] = useState(``);
  const [heroAttr, setHeroAttr] = useState(``);

  // recall from localStorage
  useEffect(() => {
    const heroStatsStore = localStorage.getItem("heroStatsStore");
    if (heroStatsStore) {
      setHeroStats(JSON.parse(heroStatsStore)); // parse back from strong
    }
  }, []); // only render once

  useEffect(() => {
    localStorage.setItem("heroStatsStore", JSON.stringify(heroStats)); // can only save string
  });

  const apiKey = `69fa7262-4da6-43f4-86ce-e69839682f49`;

  const fetchHeroStatsList = async () => {
    setHeroStatsIsLoading(true);
    setHeroStatsError(null);

    try {
      const heroStatsURL = `https://api.opendota.com/api/heroStats?api_key=${apiKey}`;
      const responseHeroStatsList = await fetch(heroStatsURL);

      if (responseHeroStatsList.status !== 200) {
        throw new Error("Hero List: HTTP Status not OK");
      }

      const heroStatsData = await responseHeroStatsList.json();

      // const heroStatsDataSorted = heroStatsData.sort((a, b) =>
      const heroStatsDataSorted = statsStats.sort((a, b) =>
        a.localized_name
          .toLowerCase()
          .localeCompare(b.localized_name.toLowerCase())
      );

      console.log(heroStatsData);
      console.log(heroStatsDataSorted);

      setHeroStats(heroStatsDataSorted);
    } catch (err) {
      setHeroStatsError(err.message);
    }
    setHeroStatsIsLoading(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchHeroStatsList();
  };

  const handleChange = (event) => {
    setHeroSelection(event.target.value);
  };

  const handleClick = (event) => {
    event.preventDefault();
    setHeroID(event.target.id);
    setHeroName(event.target.alt);
    setHeroAttr(event.target.text);
  };

  const heroFiltered = heroStats.map((list, index) => {
    return (
      <div key={index}>
        {list.localized_name
          .toLowerCase()
          .includes(heroSelection.toLowerCase()) ? (
          <img
            onClick={handleClick}
            className="heroImage heroPage"
            src={ICONS[list.hero_id]}
            alt={list.localized_name}
            id={list.hero_id}
            text={list.primary_attr}
          />
        ) : (
          <img
            onClick={handleClick}
            className="greyscale heroImage heroPage"
            src={GREYSCALE[list.hero_id]}
            alt={list.localized_name}
            id={list.hero_id}
          />
        )}
      </div>
    );
  });

  console.log(heroID);
  console.log(statsStats);

  // const heroProfile = heroStats.map((list, index) => {
  //   if (list.id === heroID) {
  //     return (
  //       <div key={index}>
  //         <img src={ICONS[heroID]} alt="" />
  //         <div>{list.localized_name}</div>
  //         <div>{list.primary_attr}</div>
  //         <div>{list.attack_type}</div>
  //       </div>
  //     );
  //   }
  // });

  return (
    <>
      <div className="container">
        <div>
          <form onSubmit={handleSubmit} className="row">
            <button>Load Heroes</button>
            <input
              className="heroInput"
              onChange={handleChange}
              value={heroSelection}
              text="text"
              placeholder="Enter hero name"
            />
          </form>
        </div>
        <h5>
          {/* {heroStatsIsLoading && <p>Loading... please wait</p>} */}
          {heroStatsIsLoading && <InvokerSpinner />}
          {!heroStatsIsLoading && heroStatsError && <p>{heroStatsError}</p>}
        </h5>
      </div>
      <div className="container profile">
        <div className="heroList col-md-6">{heroFiltered}</div>
        <div className="col-md-6">
          <img className="heroProfile" src={ICONS[heroID]} />
          {/* <h5>Name: </h5>
          <h5>Primary Attribute:</h5>
          <h5>Roles: </h5>
          <h5>Movespeed: </h5> */}
          {/* <div>{heroProfile}</div> */}
        </div>
      </div>
    </>
  );
};

export default HeroContainer;
