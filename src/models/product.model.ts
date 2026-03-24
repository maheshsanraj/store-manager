import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
} from "sequelize";
import { sequelize } from "../config/database";
import path from "path";
import fs from "fs";

export class Product extends Model<
    InferAttributes<Product>,
    InferCreationAttributes<Product>
> {
    declare id: CreationOptional<string>;
    declare tenantId: string;
    declare shopId: string;
    declare name: string;
    declare price: number;
    declare category: string;
    declare stock: CreationOptional<number>;
    declare imageUrl: string | null;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    static associate(models: any) {

        Product.belongsTo(models.Shop, {
            foreignKey: "shopId",
            as: "shop",
            onDelete: "CASCADE",
        });

        Product.belongsTo(models.Tenant, {
            foreignKey: "tenantId",
            as: "tenant",
            onDelete: "CASCADE",
        });

    }
}

Product.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        tenantId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        shopId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        category: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "products",
        timestamps: true,
        indexes: [
            {
                fields: ["tenantId"],
            },
            {
                fields: ["shopId"],
            },
            {
                unique: true,
                fields: ["shopId", "name"],
                name: "products_shop_name_unique",
            },
        ],
    }
);
Product.beforeDestroy((product: Product) => {
    if (product.imageUrl) {
        const filePath = path.join(process.cwd(), "src/uploads", product.imageUrl.split("/uploads/")[1]);
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (error) {
            console.error("Error deleting product image:", error);
        }
    }
});