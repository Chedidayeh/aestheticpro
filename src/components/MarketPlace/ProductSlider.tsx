'use client'
import React, { useRef, useState } from 'react';
import ProductListing from './ProductListing';
import { Product, Store, User } from '@prisma/client';

interface Productswithstore extends Product {
    store : Store
  }
  interface ProductReelProps {
    user?: User
    products : Productswithstore[]
  
  }
const ProductSlider = (props: ProductReelProps) => {
const { user , products } = props

const scrollContainer = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Mouse Down
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainer.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainer.current.offsetLeft);
    setScrollLeft(scrollContainer.current.scrollLeft);
  };

  // Mouse Move
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainer.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainer.current.offsetLeft;
    const walk = x - startX; // How far the mouse has moved
    scrollContainer.current.scrollLeft = scrollLeft - walk;
  };

  // Mouse Up/Leave
  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };




  return (

    <div className="my-4 w-full grid 
              lg:grid-cols-4 
              md:grid-cols-2 
              sm:grid-cols-2
              grid-cols-2
              gap-y-4
              gap-2
              sm:gap-x-8  
              md:gap-y-10
              lg:gap-x-4">
      {products.map((product, index) => (
        <div className='w-full p-2' key={index}>
        <ProductListing
          user={user!}
          key={`product-${index}`}
          product={product}
          index={index + 1}
        />
        </div>
      )).slice(4)}
    </div>
  );
};

export default ProductSlider;
