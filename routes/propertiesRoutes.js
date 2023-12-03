import express from "express";
import { body } from "express-validator"
import { showOwnedProperties, createProperty, saveProperty, addImage, storeImage, editProperty, saveEdit, removeProperty, changeState, showProperty, sendMessage, readMessages } from "../controllers/propertyController.js";
import protectRoute from "../middleware/protectRoute.js"
import uploadImage from "../middleware/uploadImage.js"
import identifyUser from "../middleware/identifyUser.js"

const router = express.Router();

router.get("/my-properties", protectRoute, showOwnedProperties);
router.get("/create", protectRoute, createProperty);
router.post("/create", protectRoute,
    body("title").notEmpty().withMessage("Hace falta un título para la propiedad"),
    body("description").notEmpty().withMessage("Hace falta una descripción").isLength({max: 500}).withMessage("La descripción debe tener 500 caracteres como máximo"),
    body("category").isNumeric().withMessage("Por favor, seleccione una categoría"),
    body("price").isNumeric().withMessage("Por favor, seleccione un rango de precio"),
    body("bedrooms").isNumeric().withMessage("Por favor, seleccione el número de habitaciones"),
    body("parking").isNumeric().withMessage("Por favor, seleccione el tamaño del estacionamiento"),
    body("bathrooms").isNumeric().withMessage("Por favor, seleccione el número de baños"),
    body("lat").isNumeric().withMessage("Por favor, ubique la propiedad en el mapa"),
    saveProperty);
router.get("/add-image/:id", protectRoute, addImage)
router.post("/add-image/:id", protectRoute, uploadImage.single("image"), storeImage)
router.get("/edit/:id", protectRoute, editProperty)
router.post("/edit/:id", protectRoute,
    body("title").notEmpty().withMessage("Hace falta un título para la propiedad"),
    body("description").notEmpty().withMessage("Hace falta una descripción").isLength({max: 500}).withMessage("La descripción debe tener 500 caracteres como máximo"),
    body("category").isNumeric().withMessage("Por favor, seleccione una categoría"),
    body("price").isNumeric().withMessage("Por favor, seleccione un rango de precio"),
    body("bedrooms").isNumeric().withMessage("Por favor, seleccione el número de habitaciones"),
    body("parking").isNumeric().withMessage("Por favor, seleccione el tamaño del estacionamiento"),
    body("bathrooms").isNumeric().withMessage("Por favor, seleccione el número de baños"),
    body("lat").isNumeric().withMessage("Por favor, ubique la propiedad en el mapa"),
    saveEdit);
router.post("remove/:id", protectRoute, removeProperty);
router.put("/properties/:id", protectRoute, changeState)

router.get("/:id", identifyUser, showProperty);

router.post("/:id", identifyUser,
    body("message").isLength({min:10}).withMessage("El mensaje debe tener mínimo 10 caracteres"),
    sendMessage);

router.get("/messages/:id",
    protectRoute,
    readMessages);

export default router;