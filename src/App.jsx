import { useEffect, useState } from "react";
import { ethers } from "ethers";

// Components
import Navigation from "./components/Navigation";
import Search from "./components/Search";
import Home from "./components/Home";

// ABIs
import RealEstate from "./abis/RealEstate.json";
import Escrow from "./abis/Escrow.json";

// Config
import config from "./config.json";

function App() {
  const [provider, setProvider] = useState(null);
  const [escrow, setEscrow] = useState(null);
  const [currAccount, setCurrAccount] = useState("");

  const [homes, setHomes] = useState([]);
  const [home, setHome] = useState(null);
  const [toggle, setToggle] = useState(false);

  const loadblockchaindata = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    setProvider(provider);

    const network = await provider.getNetwork();

    const realEstateAddr = config[network.chainId].realEstate.address;
    const escrowAddr = config[network.chainId].escrow.address;

    const realEstate = new ethers.Contract(
      realEstateAddr,
      RealEstate,
      provider
    );
    const totalProperties = await realEstate.totalSupply();
    const arr = await Promise.all(
      [1, 2, 3].map(async (i) => {
        // const uri = await realEstate.tokenURI(i + 1);
        // const response = await fetch(uri);
        // const metadata = await response.json();

        const { default: metadata } = await import(`../metadata/${i}.json`);
        return metadata;
      })
    );
    setHomes(arr);

    const escrow = new ethers.Contract(escrowAddr, Escrow, provider);
    setEscrow(escrow);

    window.ethereum.on("accountsChanged", async () => {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log(accounts);
      const account = ethers.getAddress(accounts[0]);
      setCurrAccount(account);
    });
  };

  const toggleProp = (home) => {
    setHome(home);
    setToggle(!toggle);
  };

  useEffect(() => {
    loadblockchaindata();
  }, []);

  return (
    <div>
      <Navigation account={currAccount} setAccount={setCurrAccount} />
      <Search />
      <div className="cards__section">
        <h3>Properties</h3>
        <div className="cards">
          {homes?.map((data, idx) => {
            const { name, address, description, image, id, attributes } = data;
            return (
              <div key={id} className="card" onClick={() => toggleProp(data)}>
                <div className="card__image">
                  <img src={image} alt="Home" />
                </div>
                <div className="card__info">
                  <h4>{attributes[0].value}</h4>
                  <p>
                    <strong>{attributes[2].value}</strong> bds |
                    <strong>{attributes[3].value}</strong> ba |
                    <strong>{attributes[4].value}</strong> sqft
                  </p>
                  <p>{address}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {toggle && (
        <Home
          home={home}
          provider={provider}
          account={currAccount}
          escrow={escrow}
          togglePop={toggleProp}
        />
      )}
    </div>
  );
}

export default App;
