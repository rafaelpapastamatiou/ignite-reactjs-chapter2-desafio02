import { useCallback, useEffect, useState } from 'react';

import { Header } from '../../components/Header';
import api from '../../services/api';
import { Food } from '../../components/Food';
import { ModalAddFood } from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

export interface FoodProps {
  id: number;
  name: string;
  description: string;
  price: string;
  available: boolean;
  image: string;
}

export const Dashboard = () => {
  const [foods, setFoods] = useState<FoodProps[]>([])
  const [editingFood, setEditingFood] = useState<FoodProps>({} as FoodProps)
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)

  const loadFoods = useCallback(async () => {
    const response = await api.get('/foods');

    setFoods(response.data)
  }, [])

  useEffect(() => {
    loadFoods()
  }, [loadFoods])

  const handleAddFood = useCallback(async food => {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods(state => [...state, response.data])
    } catch (err) {
      console.log(err);
    }
  }, [])

  const handleUpdateFood = useCallback(async (food: FoodProps) => {
    try {
      const foodUpdated = await api.put<FoodProps>(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated)
    } catch (err) {
      console.log(err);
    }
  }, [editingFood, foods])

  const handleDeleteFood = useCallback(async id => {
    await api.delete(`/foods/${id}`);

    setFoods(state => state.filter(food => food.id !== id))
  }, [])

  const toggleModal = useCallback(() => {
    setModalOpen(state => !state)
  }, [])

  const toggleEditModal = useCallback(() => {
    setEditModalOpen(state => !state)
  }, [])

  const handleEditFood = useCallback(food => {
    setEditModalOpen(true)
    setEditingFood(food)
  }, [])

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}
