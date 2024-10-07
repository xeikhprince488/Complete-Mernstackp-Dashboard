import Product from "../models/Product.js";
import ProductStat from "../models/ProductStat.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import bodyParser from "body-parser";
import getCountryIso3 from "country-iso-2-to-3"

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    const productWithStats = await Promise.all(
      products.map(async (product) => {
        const stat = await ProductStat.find({
          productId: product._id,
        });
        return {
          ...product._doc,
          stat,
        };
      })
    );
    res.status(200).json(productWithStats);
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: error.message });
  }
};

export const getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "user" }).select("-password");
    res.status(200).json(customers);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    let { page = 1, pageSize = 20, sort = null, search = "" } = req.query;

    // Convert page and pageSize to integers
    page = parseInt(page, 10);
    pageSize = parseInt(pageSize, 10);

    // Ensure page and pageSize are positive integers
    if (page < 1) page = 1;
    if (pageSize < 1) pageSize = 20;

    // Function to generate sort object
    const generateSort = () => {
      try {
        const sortParsed = JSON.parse(sort);
        return {
          [sortParsed.field]: sortParsed.sort === "asc" ? 1 : -1,
        };
      } catch (error) {
        // If JSON parsing fails, default to no sorting
        return {};
      }
    };

    const sortFormatted = Boolean(sort) ? generateSort() : {};

    // Query transactions with proper pagination and sorting
    const transactions = await Transaction.find({
      $or: [
        { cost: { $regex: new RegExp(search, "i") } },
        { userId: { $regex: new RegExp(search, "i") } },
      ],
    })
      .sort(sortFormatted)
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    // Count total documents matching search criteria
    const total = await Transaction.countDocuments({
      $or: [
        { cost: { $regex: search, $options: "i" } },
        { userId: { $regex: search, $options: "i" } },
      ],
    });

    res.status(200).json({
      transactions,
      total,
    });
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: error.message });
  }
};

export const getGeography = async (req, res) => {
  try {
    const users = await User.find();
    const mappedLocations = users.reduce((acc, { country }) => {
      const countryISO3 = getCountryIso3(country);
      if(!acc[countryISO3]) {
        acc[countryISO3] = 0;
      }
      acc[countryISO3]++;
      return acc;
    }, {});

    const formattedLocations = Object.entries(mappedLocations).map(
      ([country, count]) => {
        return{ id: country , value: count}
      }
    )

    res.status(200).json(formattedLocations)
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: error.message });
  }
};

export default { getProducts, getCustomers, getTransactions };
