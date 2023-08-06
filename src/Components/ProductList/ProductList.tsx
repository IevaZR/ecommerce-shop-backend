import ProductCard from "../ProductCard/ProductCard";
import "./ProductList.css";
import Button from '../ReusableComponents/Button/Button';
import { FurnitureData } from "../../data/data";
import { useState, useEffect, useMemo } from "react";
import { useFilterContext } from "../../HelperFunctions/FilterContext";

const ProductList = ({ searchQuery }) => {
    // START Filter
    const { selectedFilter } = useFilterContext();
    // END Filter
    const [products, setProducts] = useState(FurnitureData);
    // console.log(products);
    const [visibleProducts, setVisibleProducts] = useState(8);
    const [productsFound, setProductsFound] = useState(true); 


    //---FOR SEARCH BY SEARCH QUERY------
    useEffect(() => {
        setProducts(FurnitureData)
        }, [searchQuery]);

    const filterBySearchQuery = (data, query) => {
        const regex = new RegExp(`\\b${query}\\b`, 'i');
        return data.filter((item) => {
            for (const key in item) {
                const value = item[key];
                if (
                    typeof value === "string" && regex.test(value)
                ) {
                    return true;
                } else if (typeof value === "object" && value !== null) {
                    if (Array.isArray(value)) {
                        if (
                            value.some(
                                (element) => filterBySearchQuery([element], query).length > 0
                            )
                        ) {
                            return true;
                        }
                    } else {
                        if (filterBySearchQuery([value], query).length > 0) {
                            return true;
                        }
                    }
                }
            }
            return false;
        });
    };

    const foundProducts = useMemo(
        () => filterBySearchQuery(FurnitureData, searchQuery),
        [FurnitureData, searchQuery]
    );

    useEffect(() => {
        if (foundProducts.length === 0) {
            setProductsFound(false);
          } else {
            setProductsFound(true);
            setProducts(foundProducts);
          }
        }, [foundProducts]);

    //--------END OF SEARCH BY SEARCH QUERY----------

    //--------START OF FILTER------------------------
    const filterByCategory = (data, category) => {
        if (!category) {
            return data;
        }
        return data.filter((item) => item.category.toLowerCase() === category);
    };

    useEffect(() => {
        const filteredProductsByCategory = filterByCategory(FurnitureData, selectedFilter);
        const filteredProducts = filterBySearchQuery(filteredProductsByCategory, searchQuery);
        if (filteredProducts.length === 0) {
            setProductsFound(false);
        } else {
            setProductsFound(true);
            setProducts(filteredProducts);
        }
    }, [selectedFilter]);
    //--------END OF FILTER--------------------------


    const handleLoadMore = () => {
        setVisibleProducts((prevVisibleProducts) => prevVisibleProducts + 8);
    };

    const productsToShow = products.slice(0, visibleProducts);



    return (
        <div className="ProductListWrapper">
             {productsFound ? (
            <div className="ProductListContent">
                {productsToShow.map((product) => (
                    <ProductCard key={product.id} productList={product} />
                ))}
            </div>
            ) : (
                <div className="ProductsNotFoundWrapper">
                <p>Sorry, nothing was found</p>
              </div>
            )}
            {visibleProducts < products.length && (
                <Button
                    onClick={handleLoadMore}
                    text="Load More"
                ></Button>
            )}
        </div>
    );
};

export default ProductList;