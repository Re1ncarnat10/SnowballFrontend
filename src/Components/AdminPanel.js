'use client';
import React, { useState, useEffect } from 'react';
import {
    getSnowballs,
    createSnowball,
    updateSnowball,
    deleteSnowball,
    initializeData
} from '@/Components/api';

export const AdminPanel = () => {
    const [snowballs, setSnowballs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        image: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchSnowballs();
    }, []);

    const fetchSnowballs = async () => {
        try {
            setLoading(true);
            const data = await getSnowballs();
            setSnowballs(data);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to fetch snowballs' });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateSnowball(editingId, formData);
                setMessage({ type: 'success', text: 'Snowball updated successfully' });
            } else {
                await createSnowball(formData);
                setMessage({ type: 'success', text: 'Snowball created successfully' });
            }
            resetForm();
            fetchSnowballs();
        } catch (error) {
            setMessage({ type: 'error', text: `Failed: ${error.message}` });
        }
    };

    const handleEdit = (snowball) => {
        setFormData({
            name: snowball.name,
            price: snowball.price,
            description: snowball.description,
            image: snowball.image || ''
        });
        setEditingId(snowball.snowballId);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this snowball?')) return;

        try {
            await deleteSnowball(id);
            setMessage({ type: 'success', text: 'Snowball deleted successfully' });
            fetchSnowballs();
        } catch (error) {
            setMessage({ type: 'error', text: `Failed to delete: ${error.message}` });
        }
    };

    const handleInitializeData = async () => {
        if (!confirm('This will initialize sample data. Continue?')) return;

        try {
            await initializeData();
            setMessage({ type: 'success', text: 'Data initialized successfully' });
            fetchSnowballs();
        } catch (error) {
            setMessage({ type: 'error', text: `Failed to initialize data: ${error.message}` });
        }
    };

    const resetForm = () => {
        setFormData({ name: '', price: '', description: '', image: '' });
        setEditingId(null);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Snowball Admin Panel</h1>

            {message && (
                <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'} mb-4`}>
                    <span>{message.text}</span>
                    <button className="btn btn-sm" onClick={() => setMessage(null)}>Dismiss</button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card bg-base-100 shadow-sm">
                    <div className="card-body">
                        <h2 className="card-title">{editingId ? 'Edit Snowball' : 'Create New Snowball'}</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="form-control">
                                <label className="label w-20">
                                    <span className="label-text ">Name</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input input-bordered "
                                    required
                                />
                            </div>

                            <div className="form-control ">
                                <label className="label w-20">
                                    <span className="label-text">Price</span>
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="input input-bordered"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label w-20">
                                    <span className="label-text">Description</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="textarea textarea-bordered"
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label w-20">
                                    <span className="label-text">Image URL</span>
                                </label>
                                <input
                                    type="text"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    className="input input-bordered"
                                />
                            </div>

                            <div className="flex gap-2 mt-4">
                                <button type="submit" className="btn btn-primary">
                                    {editingId ? 'Update' : 'Create'}
                                </button>
                                {editingId && (
                                    <button type="button" className="btn" onClick={resetForm}>
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>

                        <div className="mt-4">
                            <button className="btn btn-outline" onClick={handleInitializeData}>
                                Initialize Sample Data
                            </button>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-sm">
                    <div className="card-body">
                        <h2 className="card-title">Snowball Products</h2>

                        {loading ? (
                            <div className="flex justify-center">
                                <span className="loading loading-spinner loading-lg"></span>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="table table-zebra">
                                    <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Price</th>
                                        <th>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {snowballs.length === 0 ? (
                                        <tr>
                                            <td colSpan="3" className="text-center">No snowballs found</td>
                                        </tr>
                                    ) : (
                                        snowballs.map((snowball) => (
                                            <tr key={snowball.snowballId}>
                                                <td>{snowball.name}</td>
                                                <td>${snowball.price}</td>
                                                <td>
                                                    <div className="flex gap-2">
                                                        <button
                                                            className="btn btn-sm btn-ghost"
                                                            onClick={() => handleEdit(snowball)}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-ghost text-error"
                                                            onClick={() => handleDelete(snowball.snowballId)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};