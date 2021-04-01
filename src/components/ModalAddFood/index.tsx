import { useCallback, useRef } from 'react';
import { FiCheckSquare } from 'react-icons/fi';

import { Form } from './styles';
import Modal from '../Modal';
import Input from '../Input';
import { FoodProps } from '../../pages/Dashboard';
import { FormHandles } from '@unform/core';

type FoodInputProps  = Omit<FoodProps, 'id'>

interface ModalAddFoodProps {
  setIsOpen: () => void;
  handleAddFood: (data: FoodInputProps) => void;
  isOpen: boolean;
}


export function ModalAddFood({
  isOpen,
  setIsOpen,
  handleAddFood
}: ModalAddFoodProps){
  const formRef = useRef<FormHandles>(null);
  
  const handleSubmit = useCallback((food:FoodInputProps) => {
    handleAddFood(food)
    setIsOpen()
  }, [handleAddFood, setIsOpen])

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Form ref={formRef} onSubmit={handleSubmit}>
        <h1>Novo Prato</h1>
        <Input name="image" placeholder="Cole o link aqui" />

        <Input name="name" placeholder="Ex: Moda Italiana" />
        <Input name="price" placeholder="Ex: 19.90" />

        <Input name="description" placeholder="Descrição" />
        <button type="submit" data-testid="add-food-button">
          <p className="text">Adicionar Prato</p>
          <div className="icon">
            <FiCheckSquare size={24} />
          </div>
        </button>
      </Form>
    </Modal>
  ) 
}
