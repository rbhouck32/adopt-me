import React, { useState, useEffect, useContext } from "react";
import pet, { ANIMALS } from "@frontendmasters/pet";
import useDropdown from "./useDropDown";
import Results from "./Results";
import ThemeContext from "./ThemeContext";

const SearchParams = () => {
  const [location, setLocation] = useState("Seattle, WA");
  // console.log("state of location: Search.js", location);
  const [breeds, setBreeds] = useState([]);
  // custom hook that handles the dropdown Menus -- see useDropDown.js----------------------
  const [animal, AnimalDropdown] = useDropdown("Animal", "dog", ANIMALS);
  const [breed, BreedDropdown, setBreed] = useDropdown("Breed", "", breeds);
  // ----------------------------------------------------------------------------------------
  const [pets, setPets] = useState([]);
  const [theme, setTheme] = useContext(ThemeContext);

  // ----------------ASYNC FUNCTION REQUEST PETS
  async function requestPets() {
    const { animals } = await pet.animals({ location, breed, type: animal });

    setPets(animals || []);
  }

  useEffect(() => {
    setBreeds([]);
    // sets a clear! on update
    setBreed("");

    pet.breeds(animal).then(({ breeds: apiBreeds }) => {
      const breedStrings = apiBreeds.map(({ name }) => name);
      setBreeds(breedStrings);
    });
  }, [animal, setBreeds, setBreed]);

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    requestPets();
  };

  return (
    <div className="search-params">
      <form onSubmit={handleSubmit}>
        <label htmlFor="location">
          Location:
          <input
            id="location"
            value={location}
            placeholder="Location"
            onChange={handleLocationChange}
          />
        </label>
        <AnimalDropdown />
        <BreedDropdown />
        <label htmlFor="theme">
          Theme
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            onBlur={(e) => setTheme(e.target.value)}
          >
            <option value="peru">Peru</option>
            <option value="darkblue">Dark Blue</option>
            <option value="mediumorchid">Medium Orchid</option>
            <option value="chartreuse">Chartreuse</option>
          </select>
        </label>

        <button style={{ backgroundColor: theme }}>Submit</button>
      </form>
      <Results pets={pets} />
    </div>
  );
};

export default SearchParams;
