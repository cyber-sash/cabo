import React from 'react';
import { motion } from 'framer-motion';
import { Card as CardType, PlayerCardInfo, Rank } from '@shared/types';
import { CARD_SIZE_CLASSES, CARD_BACK_IMAGE, cardImage, cardLabel } from '../constants/cards';

interface CardProps {
  card?: CardType | PlayerCardInfo | null;
  faceDown?: boolean;
  onClick?: () => void;
  selected?: boolean;
  glowing?: boolean;
  size?: 'sm' | 'md' | 'lg';
  index?: number;
  disabled?: boolean;
}

/** Image for one side of a card. Used by Card and by other table elements. */
export const CardArt: React.FC<{ rank: Rank | null }> = ({ rank }) => (
  <img
    src={rank === null ? CARD_BACK_IMAGE : cardImage(rank)}
    alt={rank === null ? 'Face-down card' : cardLabel(rank)}
    draggable={false}
    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
  />
);

export const Card: React.FC<CardProps> = ({
  card,
  faceDown = false,
  onClick,
  selected = false,
  glowing = false,
  size = 'md',
  index,
  disabled = false,
}) => {
  // rank 0 is a real card, so test for null/undefined rather than falsiness.
  const rank: Rank | null = card && card.rank !== null && card.rank !== undefined ? card.rank : null;
  const isFaceDown = faceDown || rank === null || (!!card && 'isRevealed' in card && !card.isRevealed);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: selected ? 1.08 : 1,
        y: selected ? -8 : 0,
      }}
      whileHover={!disabled ? { scale: 1.05, y: -4 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      onClick={!disabled ? onClick : undefined}
      role={onClick && !disabled ? 'button' : undefined}
      className={`
        ${CARD_SIZE_CLASSES[size]} relative rounded-md md:rounded-lg cursor-pointer select-none overflow-hidden
        transition-shadow duration-300 bg-cabo-card
        ${selected ? 'ring-2 ring-cabo-accent card-glow' : ''}
        ${glowing ? 'card-glow' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        shadow-lg
      `}
    >
      <CardArt rank={isFaceDown ? null : rank} />
      {isFaceDown && index !== undefined && (
        // Position number, so players can talk about "card 3".
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 min-w-[1.1rem] px-1 rounded-full bg-black/55 text-white/90 font-display text-[9px] md:text-[10px] leading-4 text-center">
          {index + 1}
        </span>
      )}
    </motion.div>
  );
};
