import React, { useState, useEffect } from 'react';
import { addNotificationAPI, getNotificationsAPI, deleteNotificationAPI } from '../services/allAPI';

function NotificationManagement() {
    const [notifications, setNotifications] = useState([]);
    const [newNotification, setNewNotification] = useState({ title: '', message: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const result = await getNotificationsAPI();
            if (result.status === 200) {
                setNotifications(result.data);
            }
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newNotification.title || !newNotification.message) {
            alert("Title and message are required");
            return;
        }

        const token = sessionStorage.getItem("token");
        const reqHeader = { "Authorization": `Bearer ${token}` };
        setLoading(true);

        try {
            const result = await addNotificationAPI(newNotification, reqHeader);
            if (result.status === 201) {
                alert("Notification created successfully");
                setNewNotification({ title: '', message: '' });
                fetchNotifications();
            }
        } catch (error) {
            console.error("Failed to add notification", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this notification?")) {
            const token = sessionStorage.getItem("token");
            const reqHeader = { "Authorization": `Bearer ${token}` };
            try {
                const result = await deleteNotificationAPI(id, reqHeader);
                if (result.status === 200) {
                    alert("Notification deleted successfully");
                    fetchNotifications();
                }
            } catch (error) {
                console.error("Delete failed", error);
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Notification Management</h1>
                <p className="text-gray-600">Broadcast updates and offers to all users</p>
            </div>

            {/* Create Notification Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Create New Notification</h2>
                <form onSubmit={handleAdd} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="e.g. Big Sale – 50% Off"
                            value={newNotification.title}
                            onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                        <textarea
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all h-24"
                            placeholder="Details of the offer or update..."
                            value={newNotification.message}
                            onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all font-medium disabled:opacity-50"
                    >
                        {loading ? 'Sending...' : 'Broadcast Notification'}
                    </button>
                </form>
            </div>

            {/* Notifications List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <h2 className="font-semibold text-gray-800">Active Notifications</h2>
                </div>
                <div className="divide-y divide-gray-100">
                    {notifications.length > 0 ? (
                        notifications.map((notif) => (
                            <div key={notif.id} className="p-6 flex justify-between items-start gap-4 hover:bg-gray-50 transition-colors">
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 mb-1">{notif.title}</h3>
                                    <p className="text-gray-600 text-sm whitespace-pre-wrap">{notif.message}</p>
                                    <p className="text-xs text-gray-400 mt-2">
                                        Published on: {new Date(notif.created_at).toLocaleString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDelete(notif.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                    title="Delete Notification"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="p-10 text-center text-gray-500 italic">
                            No notifications broadcasted yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default NotificationManagement;
