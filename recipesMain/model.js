import mongoose from "mongoose";
import recipesMainSchema from "./schema.js";

const recipesMainSchemaModel = mongoose.model("recipesMain", recipesMainSchema);

export default recipesMainSchemaModel;
