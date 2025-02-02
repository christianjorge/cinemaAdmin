import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { delay, generateId } from '../services/mockData';

export function useCrud<T extends { id?: number }>(initialData: T[]) {
  const [data, setData] = useState<T[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);

  const create = async (item: Omit<T, 'id'>) => {
    setIsLoading(true);
    try {
      // Simula delay da API
      await delay(500);
      
      const newItem = {
        ...item,
        id: generateId(data)
      } as T;
      
      setData(prev => [...prev, newItem]);
      toast.success('Item criado com sucesso!');
      return newItem;
    } catch (error) {
      toast.error('Erro ao criar item');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const update = async (id: number, item: Partial<T>) => {
    setIsLoading(true);
    try {
      await delay(500);
      
      setData(prev =>
        prev.map(prevItem =>
          prevItem.id === id ? { ...prevItem, ...item } as T : prevItem
        )
      );
      
      toast.success('Item atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar item');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const remove = async (id: number) => {
    setIsLoading(true);
    try {
      await delay(500);
      
      setData(prev => prev.filter(item => item.id !== id));
      toast.success('Item removido com sucesso!');
    } catch (error) {
      toast.error('Erro ao remover item');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    isLoading,
    create,
    update,
    remove
  };
}