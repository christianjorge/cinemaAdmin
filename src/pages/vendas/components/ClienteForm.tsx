import React from 'react';
import { useForm } from 'react-hook-form';
import { Usuario } from '../../../types';

type ClienteFormProps = {
  onSubmit: (data: Partial<Usuario>) => void;
  isLoading?: boolean;
};

export function ClienteForm({ onSubmit, isLoading }: ClienteFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<Usuario>();

  // Calcula a data máxima permitida (18 anos atrás)
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);
  const maxDateString = maxDate.toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nome Completo
        </label>
        <input
          type="text"
          {...register('nomeCompleto', { required: 'Nome é obrigatório' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.nomeCompleto && (
          <span className="text-sm text-red-600">{errors.nomeCompleto.message}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          {...register('email', { 
            required: 'Email é obrigatório',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Email inválido'
            }
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.email && (
          <span className="text-sm text-red-600">{errors.email.message}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Data de Nascimento
        </label>
        <input
          type="date"
          max={maxDateString}
          {...register('dataNascimento', { 
            required: 'Data de nascimento é obrigatória',
            validate: value => {
              const date = new Date(value);
              const age = new Date().getFullYear() - date.getFullYear();
              return age >= 18 || 'Cliente deve ter pelo menos 18 anos';
            }
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.dataNascimento && (
          <span className="text-sm text-red-600">{errors.dataNascimento.message}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Telefone
        </label>
        <input
          type="text"
          {...register('telefone', { required: 'Telefone é obrigatório' })}
          placeholder="(00) 00000-0000"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.telefone && (
          <span className="text-sm text-red-600">{errors.telefone.message}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Endereço
        </label>
        <input
          type="text"
          {...register('endereco', { required: 'Endereço é obrigatório' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.endereco && (
          <span className="text-sm text-red-600">{errors.endereco.message}</span>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
}