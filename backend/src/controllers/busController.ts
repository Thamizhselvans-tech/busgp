import { Request, Response } from 'express';
import { Bus } from '../models/Bus.js';

// Haversine formula to calculate distance in km between two lat/lng points
const calculateHaversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // Rounded to 1 decimal place
};

export const getAllBuses = async (req: Request, res: Response) => {
  try {
    const { search, status, route } = req.query;
    const query: any = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (route) {
      query.route = { $regex: route as string, $options: 'i' };
    }

    if (search) {
      const searchRegex = new RegExp(search as string, 'i');
      query.$or = [
        { busNumber: searchRegex },
        { route: searchRegex },
        { source: searchRegex },
        { destination: searchRegex },
        { registrationNumber: searchRegex },
      ];
    }

    const buses = await Bus.find(query).sort({ busNumber: 1 });

    return res.status(200).json({
      success: true,
      data: { buses },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch buses.',
    });
  }
};

export const getNearbyBuses = async (req: Request, res: Response) => {
  try {
    const lat = req.query.lat ? parseFloat(req.query.lat as string) : 13.0827; // Default Chennai
    const lng = req.query.lng ? parseFloat(req.query.lng as string) : 80.2707;
    const radius = req.query.radius ? parseFloat(req.query.radius as string) : 50; // Default 50 km radius search

    const allBuses = await Bus.find();

    const formattedBuses = allBuses
      .map((bus) => {
        const busLat = bus.currentLat || 13.0827;
        const busLng = bus.currentLng || 80.2707;
        const distanceKm = calculateHaversineDistance(lat, lng, busLat, busLng);
        const speed = bus.speed || 28;
        const etaMinutes = Math.max(2, Math.round((distanceKm / (speed || 25)) * 60));

        return {
          _id: bus._id,
          id: bus._id,
          busNumber: bus.busNumber,
          registrationNumber: bus.registrationNumber,
          route: bus.route,
          source: bus.source,
          destination: bus.destination,
          latitude: busLat,
          longitude: busLng,
          currentLat: busLat,
          currentLng: busLng,
          speed: bus.speed || 28,
          heading: bus.heading || 90,
          status: bus.status || 'moving',
          distance: `${distanceKm} km`,
          distanceKm,
          eta: `${etaMinutes} min`,
          etaMinutes,
          expectedArrival: new Date(Date.now() + etaMinutes * 60000).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          routeCoordinates: bus.routeCoordinates || [],
          lastUpdated: bus.lastUpdated || bus.updatedAt,
          isSimulated: bus.isSimulated !== undefined ? bus.isSimulated : true,
          isLiveAvailable: bus.isLiveAvailable !== undefined ? bus.isLiveAvailable : true,
        };
      })
      .filter((b) => b.distanceKm <= radius)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    return res.status(200).json({
      success: true,
      isLiveAvailable: true,
      message: `${formattedBuses.length} buses detected near radius ${radius} km.`,
      buses: formattedBuses,
      data: { buses: formattedBuses },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch nearby buses.',
    });
  }
};

export const getBusById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const bus = await Bus.findById(id);

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: { bus },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch bus details.',
    });
  }
};

export const getBusLocation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const bus = await Bus.findById(id);

    if (!bus) {
      return res.status(404).json({ success: false, message: 'Bus not found' });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: bus._id,
        busNumber: bus.busNumber,
        latitude: bus.currentLat,
        longitude: bus.currentLng,
        speed: bus.speed,
        heading: bus.heading,
        status: bus.status,
        lastUpdated: bus.lastUpdated,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getBusRoute = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const bus = await Bus.findById(id);

    if (!bus) {
      return res.status(404).json({ success: false, message: 'Bus not found' });
    }

    return res.status(200).json({
      success: true,
      data: {
        busNumber: bus.busNumber,
        routeName: bus.route,
        source: bus.source,
        destination: bus.destination,
        routeCoordinates: bus.routeCoordinates,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBusLocation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { latitude, longitude, speed, heading, status } = req.body;

    const bus = await Bus.findByIdAndUpdate(
      id,
      {
        currentLat: latitude,
        currentLng: longitude,
        speed: speed || 28,
        heading: heading || 90,
        status: status || 'moving',
        lastUpdated: new Date(),
      },
      { new: true }
    );

    if (!bus) {
      return res.status(404).json({ success: false, message: 'Bus not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Bus telemetry updated successfully.',
      data: { bus },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createBus = async (req: Request, res: Response) => {
  try {
    const {
      busNumber,
      registrationNumber,
      route,
      source,
      destination,
      driver,
      conductor,
      assignedOfficer,
      status,
      currentLat,
      currentLng,
      routeCoordinates,
    } = req.body;

    if (!busNumber || !registrationNumber || !route || !source || !destination) {
      return res.status(400).json({
        success: false,
        message: 'Bus Number, Registration Number, Route, Source, and Destination are required.',
      });
    }

    const bus = await Bus.create({
      busNumber: busNumber.toUpperCase(),
      registrationNumber,
      route,
      source,
      destination,
      driver: driver || '',
      conductor: conductor || '',
      assignedOfficer: assignedOfficer || null,
      status: status || 'moving',
      currentLat: currentLat || 13.0827,
      currentLng: currentLng || 80.2707,
      routeCoordinates: routeCoordinates || [],
    });

    return res.status(201).json({
      success: true,
      message: 'Bus created successfully.',
      data: { bus },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create bus.',
    });
  }
};

export const updateBus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const bus = await Bus.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!bus) {
      return res.status(404).json({ success: false, message: 'Bus not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Bus updated successfully.',
      data: { bus },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update bus.',
    });
  }
};

export const deleteBus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const bus = await Bus.findByIdAndDelete(id);

    if (!bus) {
      return res.status(404).json({ success: false, message: 'Bus not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Bus removed successfully.',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete bus.',
    });
  }
};

export const detectNearbyBuses = getNearbyBuses;
