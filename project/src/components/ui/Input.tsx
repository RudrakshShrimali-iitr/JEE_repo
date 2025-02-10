import React from 'react';

export function Input({ type, name, placeholder, value, onChange }: any) {
    return (
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="border p-2 rounded w-full"
            required
        />
    );
}
