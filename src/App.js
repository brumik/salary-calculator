import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import {
  Toolbar,
  Switch,
  FormGroup,
  FormControlLabel,
  Typography,
  Box,
  AppBar,
  LinearProgress,
  Slider,
} from "@mui/material";
import { useEffect, useState } from "react";

const formatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const doCalculate = ({
  salary,
  years,
  bonus,
  merit,
  investing,
  investingReturn,
  inflation,
}) => {
  const ret = {
    salary: salary,
    inflatedSalary: salary,
    income: 0,
    inflatedIncome: 0,
  };

  let savings = 0;
  let inflatedSavings = 0;

  for (let i = 0; i < years; i += 1) {
    ret.income += ret.salary;
    ret.inflatedIncome += ret.inflatedSalary;

    ret.salary = ret.salary * (1 + merit / 100);
    ret.inflatedSalary =
      ret.inflatedSalary * (1 + merit / 100 - inflation / 100);

    savings =
      savings * (1 + investingReturn / 100) + ret.salary * (bonus / 100);
    inflatedSavings =
      inflatedSavings * (1 + investingReturn / 100 - inflation / 100) +
      ret.salary * (bonus / 100);
  }

  if (investing) {
    ret.income += savings;
    ret.inflatedIncome += inflatedSavings;
  }

  return ret;
};

const App = () => {
  const [settings, setSettings] = useState({
    salary: 700000,
    years: 10,
    bonus: 10,
    merit: 3,
    investing: true,
    investingReturn: 10,
    inflation: 3,
  });

  const [results, setResults] = useState({
    salary: 120000,
    inflatedSalary: 110000,
    income: 500000000,
    inflatedIncome: 50000000,
  });

  const [loading, setLoading] = useState(true);

  const updateSettings = (field, value) => {
    setSettings((old) => ({
      ...old,
      [field]: value,
    }));
  };

  useEffect(() => {
    setLoading(true);
    setResults(
      doCalculate({
        salary: +settings.salary,
        years: +settings.years,
        bonus: +settings.bonus,
        merit: +settings.merit,
        investing: +settings.investing,
        investingReturn: +settings.investingReturn,
        inflation: +settings.inflation,
      }),
    );
    setLoading(false);
  }, [settings]);

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Salary Calculator
          </Typography>
        </Toolbar>
      </AppBar>
      <Box py={3} maxWidth="1100px" marginX="auto">
        <Grid
          container
          spacing={2}
          justifyContent="center"
          alignItems="center"
          direction="row"
        >
          <Grid item>
            <TextField
              label="Initial yearly salary"
              value={settings.salary}
              onChange={(e) => updateSettings("salary", e.target.value)}
            />
            <Slider
              size="small"
              value={settings.salary}
              onChange={(e) => updateSettings("salary", e.target.value)}
              step={100000}
              min={1000}
              max={500000}
            />
          </Grid>
          <Grid item>
            <TextField
              label="Planned years to work at the company"
              value={settings.years}
              onChange={(e) => updateSettings("years", e.target.value)}
            />
            <Slider
              size="small"
              value={settings.years}
              onChange={(e) => updateSettings("years", e.target.value)}
              step={1}
              min={1}
              max={50}
            />
          </Grid>
          <Grid item>
            <TextField
              label="Expected yearly bonus %"
              value={settings.bonus}
              onChange={(e) => updateSettings("bonus", e.target.value)}
            />
            <Slider
              size="small"
              value={settings.bonus}
              onChange={(e) => updateSettings("bonus", e.target.value)}
              step={1}
              min={0}
              max={100}
            />
          </Grid>
          <Grid item>
            <TextField
              label="Expected merit % (yearly pay increase)"
              value={settings.merit}
              onChange={(e) => updateSettings("merit", e.target.value)}
            />
            <Slider
              size="small"
              value={settings.merit}
              onChange={(e) => updateSettings("merit", e.target.value)}
              step={1}
              min={0}
              max={25}
            />
          </Grid>
          <Grid item>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    defaultChecked
                    value={settings.investing}
                    onChange={(e) =>
                      updateSettings("investing", e.target.checked)
                    }
                  />
                }
                label="Investing the full bonus"
              />
            </FormGroup>
          </Grid>
          <Grid item>
            <TextField
              label="Expeted yearly return on bonus %"
              disabled={!settings.investing}
              value={settings.investingReturn}
              onChange={(e) =>
                updateSettings("investingReturn", e.target.value)
              }
            />
            <Slider
              size="small"
              value={settings.investingReturn}
              onChange={(e) =>
                updateSettings("investingReturn", e.target.value)
              }
              step={1}
              min={0}
              max={25}
            />
          </Grid>
          <Grid item>
            <TextField
              label="Expected yearly inflation %"
              value={settings.inflation}
              onChange={(e) => updateSettings("inflation", e.target.value)}
            />
            <Slider
              size="small"
              value={settings.inflation}
              onChange={(e) => updateSettings("inflation", e.target.value)}
              step={1}
              min={0}
              max={25}
            />
          </Grid>
        </Grid>

        <Box my={3}>{loading ? <LinearProgress /> : <hr />}</Box>

        <Grid container spacing={2} textAlign="center" justifyContent="center">
          <Grid item sm={6} md={3}>
            <Typography>Base salary at the end:</Typography>
            <Typography variant="h4" gutterBottom>
              {formatter.format(results.salary)}
            </Typography>
          </Grid>
          <Grid item sm={6} md={3}>
            <Typography>Inflated base salary at the end:</Typography>
            <Typography variant="h4" gutterBottom>
              {formatter.format(results.inflatedSalary)}
            </Typography>
          </Grid>
          <Grid item sm={6} md={3}>
            <Typography>Total income:</Typography>
            <Typography variant="h4" gutterBottom>
              {formatter.format(results.income)}
            </Typography>
          </Grid>
          <Grid item sm={6} md={3}>
            <Typography>Inflation adjusted total income:</Typography>
            <Typography variant="h4">
              {formatter.format(results.inflatedIncome)}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default App;
