import { useState, useEffect, RefObject } from 'react';

export default function BackToTopButton({
  container,
}: {
  container: RefObject<HTMLDivElement>;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const _container = container.current;
    const toggleVisibility = () => {
      console.log(_container!.scrollTop);
      if (_container!.scrollTop > 2000) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    _container!.addEventListener('scroll', toggleVisibility);

    return () => {
      _container!.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = async () => {
    const _container = container.current;
    await _container!.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div
      className={`fixed bottom-10 right-10 p-4 bg-blue-500/60 backdrop-blur-sm text-white rounded-full cursor-pointer transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={scrollToTop}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </div>
  );
}
