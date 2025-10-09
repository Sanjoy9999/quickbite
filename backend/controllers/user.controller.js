import User from "../models/user.model.js";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "UserId is not found" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `get current user error ${error.message}` });
  }
};

export const updateLocation = async (req, res) => {
  try {
    const { lat, lon } = req.body;
    
    if (!lat || !lon) {
      return res.status(400).json({ message: "lat and lon are required" });
    }
    
    // ✅ GeoJSON format: [longitude, latitude] - lon FIRST, lat SECOND
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        location: {
          type: "Point",
          coordinates: [Number(lon), Number(lat)],
        },
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Location updated successfully",
      location: user.location,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Update location error ${error.message}` });
  }
};

// ✅ Add this new function
export const updateCurrentCity = async (req, res) => {
  try {
    const { city } = req.body;
    
    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { currentCity: city },
      { new: true }
    );

    return res.status(200).json({
      message: "Current city updated successfully",
      currentCity: user.currentCity,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Update current city error ${error.message}` });
  }
};