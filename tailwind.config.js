module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
       borderWidth: {
        '0.5': '0.5px',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        opensans: ['"Open Sans"', 'sans-serif']
      },
      screens: {
        'reset-on-top':'500px',
        'sm-md': '350px',
        'md-lg': '800px', 
        'md-lg-main': '1300px',
        'md-lg-main-1': '1400px',
        'md-lg-main1': '1500px',
        'md-lg-main-1-2':'1600px',
        'md-lg-main-2': '1700px',
        'md-lg-main2': '1900px'
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.text-shadow': {
          'text-shadow': '0.3px 0.3px 0.9px rgba(0, 0, 0, 0.45)',
        },
        '.text-shadow-md': {
          'text-shadow': '1px 1px 2px rgba(0, 0, 0, 0.45)',
        },
        '.text-shadow-lg': {
          'text-shadow': '4px 4px 8px rgba(0, 0, 0, 0.45)',
        },
    
        '.text-underline': {
           'hover':'text-blue-900 text-shadow border-hidden font-semibold relative cursor-pointer transition-all ease-in-out before:transition-[width] before:ease-in-out before:duration-700 before:absolute before:bg-blue-900 before:origin-center before:h-[2px] before:w-0 hover:before:w-[50%] before:bottom-0 before:left-[50%] after:transition-[width] after:ease-in-out after:duration-700 after:absolute after:bg-blue-900 after:origin-center after:h-[2px] after:w-0 hover:after:w-[50%] after:bottom-0 after:right-[50%]'
        },
       

      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
};
