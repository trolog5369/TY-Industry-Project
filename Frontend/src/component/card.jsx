import { useNavigate } from "react-router-dom";
import React from 'react';
import { 
  FiFileText, 
  FiPlusCircle, 
  FiDollarSign, 
  FiBarChart2, 
  FiShoppingBag, 
  FiUser, 
  FiTruck, 
  FiGrid 
} from 'react-icons/fi';

const Card = (props) => {
  const navigate = useNavigate();

  // Map titles to corresponding icons
  const getIcon = () => {
    switch(props.title) {
      case 'Bill Generator':
        return <FiFileText className="w-12 h-12 mb-4 drop-shadow-[0_0_15px_rgba(14,165,233,0.8)] text-[#0EA5E9] group-hover:scale-110 transition-transform duration-300" />;
      case 'Add Products':
        return <FiPlusCircle className="w-12 h-12 mb-4 drop-shadow-[0_0_15px_rgba(14,165,233,0.8)] text-[#0EA5E9] group-hover:rotate-90 transition-transform duration-500" />;
      case 'Show Bills':
        return <FiDollarSign className="w-12 h-12 mb-4 drop-shadow-[0_0_15px_rgba(14,165,233,0.8)] text-[#0EA5E9] group-hover:scale-110 transition-transform duration-300" />;
      case 'Stock Analysis':
        return <FiBarChart2 className="w-12 h-12 mb-4 drop-shadow-[0_0_15px_rgba(14,165,233,0.8)] text-[#0EA5E9] group-hover:-translate-y-2 transition-transform duration-300" />;
      case 'Shop Products':
        return <FiShoppingBag className="w-12 h-12 mb-4 drop-shadow-[0_0_15px_rgba(14,165,233,0.8)] text-[#0EA5E9] group-hover:scale-110 transition-transform duration-300" />;
      case 'Customer Account':
        return <FiUser className="w-12 h-12 mb-4 drop-shadow-[0_0_15px_rgba(14,165,233,0.8)] text-[#0EA5E9] group-hover:-translate-y-2 transition-transform duration-300" />;
      case 'Supplier Data':
        return <FiTruck className="w-12 h-12 mb-4 drop-shadow-[0_0_15px_rgba(14,165,233,0.8)] text-[#0EA5E9] group-hover:translate-x-2 transition-transform duration-300" />;
      case 'Notes':
        return <FiGrid className="w-12 h-12 mb-4 drop-shadow-[0_0_15px_rgba(14,165,233,0.8)] text-[#0EA5E9] group-hover:rotate-180 transition-transform duration-500" />;
      default:
        return <FiGrid className="w-12 h-12 mb-4 drop-shadow-[0_0_15px_rgba(14,165,233,0.8)] text-[#0EA5E9]" />;
    }
  };

  // Border hover effects and glow based on the card logic
  const getGlow = () => {
    switch(props.title) {
      case 'Bill Generator': return 'hover:shadow-[0_0_30px_rgba(14,165,233,0.2)] hover:border-[rgba(14,165,233,0.35)]';
      case 'Add Products': return 'hover:shadow-[0_0_30px_rgba(14,165,233,0.2)] hover:border-[rgba(14,165,233,0.35)]';
      case 'Show Bills': return 'hover:shadow-[0_0_30px_rgba(14,165,233,0.2)] hover:border-[rgba(14,165,233,0.35)]';
      case 'Stock Analysis': return 'hover:shadow-[0_0_30px_rgba(14,165,233,0.2)] hover:border-[rgba(14,165,233,0.35)]';
      case 'Shop Products': return 'hover:shadow-[0_0_30px_rgba(14,165,233,0.2)] hover:border-[rgba(14,165,233,0.35)]';
      case 'Customer Account': return 'hover:shadow-[0_0_30px_rgba(14,165,233,0.2)] hover:border-[rgba(14,165,233,0.35)]';
      case 'Supplier Data': return 'hover:shadow-[0_0_30px_rgba(14,165,233,0.2)] hover:border-[rgba(14,165,233,0.35)]';
      case 'Notes': return 'hover:shadow-[0_0_30px_rgba(14,165,233,0.2)] hover:border-[rgba(14,165,233,0.35)]';
      default: return 'hover:border-[rgba(14,165,233,0.35)]';
    }
  };

  const handleCardClick = () => {
    const routes = {
      'Bill Generator': '/billgenerator',
      'Add Products': '/inventorymanager',
      'Show Bills': '/showbills',
      'Stock Analysis': '/stockanalysis',
      'Shop Products': '/productlist',
      'Customer Account': '/customeraccount',
      'Supplier Data': '/supplierData',
      'Notes': '/notes'
    };
    
    if (routes[props.title]) {
      navigate(routes[props.title]);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`group relative overflow-hidden bg-[#0F1927] border border-[rgba(14,165,233,0.1)] w-full rounded-2xl flex flex-col items-center justify-center p-6 cursor-pointer transition-all duration-200 transform hover:-translate-y-[3px] text-white hover:bg-[#111C2D] ${getGlow()}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      
      <div className="flex justify-center items-center relative z-10">
        <div className="p-4 bg-[rgba(14,165,233,0.1)] rounded-2xl mb-2">
          {props.image ? (
            <img 
              src={props.image} 
              alt={props.title} 
              className="w-16 h-16 object-contain group-hover:scale-110 transition-transform duration-300" 
            />
          ) : (
            <div className="flex items-center justify-center">
              {getIcon()}
            </div>
          )}
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-center tracking-wide mb-2 relative z-10 group-hover:text-white transition-colors text-gray-200">
        {props.title}
      </h3>
      <p className="text-xs text-center text-gray-400 tracking-wider uppercase mb-6 relative z-10 group-hover:text-gray-300 transition-colors">
        {props.description || 'Access Module'}
      </p>
      
      <div className="mt-auto w-full relative z-10">
        <button className="w-full py-2 px-4 rounded-xl border border-[rgba(14,165,233,0.2)] bg-[#111C2D] hover:bg-[#162236] transition-all duration-300 text-sm font-bold tracking-[0.1em] uppercase text-[#0EA5E9]">
          Launch
        </button>
      </div>
    </div>
  );
};

export default Card;