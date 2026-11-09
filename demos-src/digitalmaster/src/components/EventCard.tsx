import React from 'react';

type CardComponentProps = {
    imageUrl: string;
    title: string;
    date?: string;
    // badgeType?: string;
    badgeIcon?: React.ReactNode;
    onClick?: () => void;
};

const CardComponent: React.FC<CardComponentProps> = ({ imageUrl, title, date, onClick }) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer h-full min-w-40 w-40 m-1" onClick={onClick}>
            <div className="relative">
                <img src={imageUrl} alt="Card Image" className=" px-3 pt-3 mb-2 w-full h-30 object-cover rounded-2xl" />
            </div>
            <div className="px-2">
                <div className="text-md font-bold mb-1 ml-2">{title}</div>
                <div className="ml-2 text-xs text-gray-400 mb-6">{date}</div>
            </div>
        </div>
    );
};

export default CardComponent;
