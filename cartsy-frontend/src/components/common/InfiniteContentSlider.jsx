// src/components/common/InfiniteContentSlider.jsx

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
} from "framer-motion";

import {
  ShoppingBag,
  Truck,
  ShieldCheck,
  Tag,
  RefreshCcw,
  CreditCard,
} from "lucide-react";

// Professional e-commerce messages
const messages = [
  { icon: ShoppingBag, text: "Explore premium products curated for you" },
  { icon: Truck, text: "Fast and reliable delivery across India" },
  { icon: ShieldCheck, text: "Secure checkout with trusted payment options" },
  { icon: Tag, text: "Exclusive deals and limited-time offers" },
  { icon: RefreshCcw, text: "Easy returns and hassle-free refunds" },
  { icon: CreditCard, text: "Multiple payment options available" },
];

const InfiniteContentSlider = () => {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(0);

  const x = useMotionValue(0);
  const speed = 0.6; // adjust speed here

  // calculate width for loop
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.scrollWidth / 2);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);

    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // smooth infinite animation
  useAnimationFrame(() => {
    let current = x.get();
    let next = current - speed;

    if (next <= -width) {
      next = 0;
    }

    x.set(next);
  });

  return (
    <div className="w-full overflow-hidden border-y border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
      <motion.div
        ref={containerRef}
        style={{ x }}
        className="flex items-center gap-10 py-3"
      >
        {[...messages, ...messages].map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="flex items-center gap-2 text-gray-700 whitespace-nowrap"
            >
              <Icon className="w-4 h-4 text-indigo-600" />
              <span className="text-sm md:text-base font-medium">
                {item.text}
              </span>

              <span className="text-gray-400 mx-2">•</span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default InfiniteContentSlider;