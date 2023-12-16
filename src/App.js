import React from 'react';
import { useEffect, useState } from 'react';
import contract from './contract/contracts/Convertor.sol/Convertor.json';
import { ethers } from 'ethers';
import './App.css';

import { makeStyles } from '@mui/styles';
import {
  Typography,
  Card,
  CardHeader,
  CardContent,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
} from '@mui/material';
import { teal, purple } from '@mui/material/colors';
import {color} from "@mui/system";

const contractAddress = '0x596983EbAE3183CBEB7beD4D420431cb0E62797f';
const abi = contract.abi;

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  },
  card: {
    width: '400px',
    marginBottom: theme.spacing(3),
  },
  radioButtons: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
  result: {
    marginTop: theme.spacing(3),
    textAlign: 'center',
  },
  label1: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
    color: purple[500],
  },
}));

const App = () => {
  const classes = useStyles();

  const [selectedPair, setSelectedPair] = useState('btcUsd');
  const [loading, setLoading] = useState(false);
  const [prices, setPrices] = useState({
    btcUsd: null,
    ethUsd: null,
    linkUsd: null,
    btcEth: null,
  });

  useEffect(() => {
    const fetchPrices = async () => {
      if (typeof window.ethereum !== 'undefined') {
        setLoading(true);

        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(contractAddress, abi, signer);
          const result = await contract.getLatestPrices();

          setPrices({
            btcUsd: result[0].toString(),
            ethUsd: result[1].toString(),
            linkUsd: result[2].toString(),
            btcEth: result[3].toString(),
          });
        } catch (error) {
          console.error('Error fetching prices:', error);
        } finally {
          setLoading(false);
        }
      } else {
        console.error('MetaMask is not installed');
      }
    };

    fetchPrices();
  }, [selectedPair]);

  const formatPrice = (price) => {
    if (selectedPair === 'btcEth') {
      const decimals = 18;
      const formattedPrice = ethers.utils.formatUnits(price, decimals);
      return formattedPrice;
    } else {
      const decimals = 8;
      const formattedPrice = ethers.utils.formatUnits(price, decimals);
      return formattedPrice;
    }
  };

  return (
      <div className={classes.container}>
        <Card className={classes.card}>
          <CardHeader title="Live Conversion Prices" style={{ backgroundColor: "lightblue" }} />
          <CardContent>
            <div className={classes.radioButtons}>
              <RadioGroup column value={selectedPair} onChange={(e) => setSelectedPair(e.target.value)}>
                <FormControlLabel value="btcUsd" control={<Radio />} label="BTC/USD" />
                <FormControlLabel value="ethUsd" control={<Radio />} label="ETH/USD" />
                <FormControlLabel value="linkUsd" control={<Radio />} label="LINK/USD" />
                <FormControlLabel value="btcEth" control={<Radio />} label="BTC/ETH" />
              </RadioGroup>
            </div>
            <div className={classes.result}>
              {loading ? (
                  <CircularProgress />
              ) : prices[selectedPair] !== null ? (
                  <>
                    <Typography className={classes.label1}>{selectedPair.toUpperCase()} Conversion:</Typography>
                    <Typography>
                      1 {selectedPair.toUpperCase().slice(0, -3)} ={' '}
                      {formatPrice(prices[selectedPair])}{' '}
                      {selectedPair.toUpperCase().substring(selectedPair.length - 3)}
                    </Typography>
                  </>
              ) : (
                  <Typography>No data available.</Typography>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
  );
};

export default App;
