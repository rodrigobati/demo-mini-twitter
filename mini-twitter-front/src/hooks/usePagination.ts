/**
 * Hook usePagination
 * 
 * Responsabilidad: Lógica de paginación client-side
 * - Calcular páginas de un array
 * - Navegar entre páginas
 * - Determinar si hay siguiente/anterior
 */

import { useState, useMemo } from 'react';

interface UsePaginationOptions {
  itemsPerPage: number;
}

export const usePagination = <T,>(items: T[], options: UsePaginationOptions) => {
  const { itemsPerPage } = options;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  const hasNext = currentPage < totalPages;
  const hasPrevious = currentPage > 1;

  const goToNextPage = () => {
    if (hasNext) {
      setCurrentPage((prev: number) => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (hasPrevious) {
      setCurrentPage((prev: number) => prev - 1);
    }
  };

  const resetPagination = () => {
    setCurrentPage(1);
  };

  return {
    currentPage,
    totalPages,
    paginatedItems,
    hasNext,
    hasPrevious,
    goToNextPage,
    goToPreviousPage,
    resetPagination,
  };
};
