const service = require("./observations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const validSkyConditions = [100, 101, 102, 103, 104, 106, 108, 109];

function hasData(req, res, next) {
  if (req.body.data) {
    return next();
  }
  next({ status: 400, message: "body must have data property" });
}

function hasLatitude(req, res, next) {
  const latitude = Number(req.body.data.latitude);
  if (latitude >= -90 && latitude <= 90) {
    return next();
  }
  next({ status: 400, message: "latitude must be between -90 and 90" });
}

function hasLongitude(req, res, next) {
  const longitude = Number(req.body.data.longitude);
  if (longitude >= -180 && longitude <= 180) {
    return next();
  }
  next({ status: 400, message: "longitude must be between -180 and 180" });
}

function hasAirTemperature(req, res, next) {
  const airTemperature = Number(req.body.data.air_temperature);
  if (airTemperature >= -50 && airTemperature <= 107) {
    return next();
  }
  next({ status: 400, message: "air temperature must be between -50 and 107" });
}
function hasAirTemperatureUnit(req, res, next) {
  const airTemperatureUnit = req.body.data.air_temperature_unit;
  if (airTemperatureUnit === 'C' || airTemperatureUnit === 'F') {
    return next();
  }
  next({ status: 400, message: "air temperature unit must be 'C' for Celcius or 'F' for Farenheit" });
}



function hasSkyCondition(req, res, next) {
  const skyCondition = Number(req.body.data.sky_condition);

  if (validSkyConditions.includes(skyCondition)) {
    return next();
  }
  next({
    status: 400,
    message: `sky_condition must be one of: ${validSkyConditions}`,
  });
}

async function observationExists(req, res, nxt) {
  const observation = await service.read(req.params.observationId);


  if (observation) {
    res.locals.observation = observation;
    return nxt();
  }
  nxt({ status: 404, message: "Observation cannot be found" });
}

async function create(req, res) {
  const newObservation = await service.create(req.body.data);

  res.status(201).json({
    data: newObservation,
  });
}

async function update(req, res) {
  const updatedObservation = {
    ...req.body.data,
    observation_id: res.locals.observation.observation_id,
  };
  
  const data = await service.update(updatedObservation);
  res.json({ data });
}

async function list(req, res) {
  res.json({
    data: await service.list(),
  });
}

async function read(req, res) {
  res.json({ data: res.locals.observation });
}

module.exports = {
  create: [
    hasData,
    hasLatitude,
    hasLongitude,
    hasAirTemperature,
    hasAirTemperatureUnit,
    hasSkyCondition,
    asyncErrorBoundary(create),
  ],
  update: [
    asyncErrorBoundary(observationExists),
    hasData,
    hasLatitude,
    hasLongitude,
    hasAirTemperature,
    hasAirTemperatureUnit,
    hasSkyCondition,
    asyncErrorBoundary(update),
  ],
  list,
  read: [asyncErrorBoundary(observationExists), read],
};
