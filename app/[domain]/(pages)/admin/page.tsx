// pages/admin/dashboard.js
'use client'
import {
    Button,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Modal,
    Select,
    TextField
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import {
    assignRoleAsync,
    createRoleAsync,
    deleteUserAsync,
    fetchRolesAsync,
    fetchUsersWithRoles,
    formattedDate,
    getAccessToken,
    saveUserAsync,
    searchUsersWithRoles
} from '../../../_lib/util';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import { SearchOutlined } from '@mui/icons-material';

export default function AdminDashboard() {
    const [roles, setRoles] = useState([]);
    const [users, setUsers] = useState([]);
    const [roleName, setRoleName] = useState<string>('');
    const [roleDescription, setRoleDescription] = useState<string>('');
    const [selectedRoleId, setSelectedRoleId] = useState<string>('');
    const [openEditModal, setOpenEditModal] = useState<boolean>(false);
    const [editUserFormData, setEditUserFormData] = useState({ user_id: '', name: '', roles: '' });
    const [auth0AccessToken, setAuth0AccessToken] = useState<string>('');
    const [openAddModal, setOpenAddModal] = useState<boolean>(false);
    const [addUserFormData, setAddUserFormData] = useState({
        "email": "",
        "name": "",
        "password": "",
        "user_metadata": {
            "roles": []
        },
        "connection": "Username-Password-Authentication"
    });
    const [searchString, setSearchString] = useState<string>();

    const columns: GridColDef<(typeof rows)[number]>[] = [
        {
            field: 'id',
            headerName: 'ID',
            width: 200,
        },
        {
            field: 'name',
            headerName: 'Name',
            width: 200,
        },
        {
            field: 'role',
            headerName: 'Role',
            width: 150,
        },
        {
            field: 'joined_date',
            headerName: 'Joined Date',
            width: 180,
        },
        {
            field: 'last_login',
            headerName: 'Last Login',
            width: 180
        },
        {
            field: 'actions',
            headerName: 'Action',
            description: 'Edit or delete user',
            width: 150,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <>
                    <IconButton
                        color="secondary"
                        onClick={() => deleteUser((params.id as string))}
                    >
                        <DeleteForeverIcon color='primary' />
                    </IconButton>
                    <IconButton
                        color="secondary"
                        onClick={() => handleEditClick((params.id as string))}
                    >
                        <EditIcon color='primary' />
                    </IconButton>
                </>
            ),
        },
    ];

    const rows = users.map(user => {
        //@ts-ignore
        return { id: user.user_id, name: user.name, role: user.user_metadata.roles, last_login: formattedDate(user.last_login), joined_date: formattedDate(user.created_at) }
    });

    const getToken = (): void => {
        const token: string | null = localStorage.getItem('auth0AccessToken');
        const decodedToken: any = jwt.decode((token as string))
        if (token && decodedToken && decodedToken.exp > ((new Date().getTime()) / 1000)) {
            setAuth0AccessToken(token);
        } else {
            const token = getAccessToken();
            token.then(token => {
                setAuth0AccessToken(token);
                localStorage.setItem('auth0AccessToken', token);
            });
        }
    };

    useEffect(() => {
        if (auth0AccessToken) {
            fetchRoles();
            fetchUsers();
        } else {
            getToken();
        }
    }, [auth0AccessToken]);

    const fetchRoles = async () => {
        fetchRolesAsync((auth0AccessToken as string)).then(data => {
            setRoles(data);
        });
    };

    const fetchUsers = (): void => {
        //@ts-ignore
        fetchUsersWithRoles(auth0AccessToken).then(data => setUsers(data));
    };

    const createRole = () => {
        createRoleAsync((auth0AccessToken as string), roleName, roleDescription).then(() => {
            fetchRoles();
            setRoleName('');
            setRoleDescription('');
        });
    };

    const deleteUser = (selectedUserId: string): void => {
        deleteUserAsync((auth0AccessToken as string), selectedUserId).then(() => {
            const usersAfterDelete = users.filter((user: any) => user.user_id !== selectedUserId);
            setUsers(usersAfterDelete);
        })
    };

    const handleEditClick = (userId: string): void => {
        const selectedUsers: any = users.find((user: any) => user.user_id === userId);
        setEditUserFormData(selectedUsers!);
        setOpenEditModal(true);
    };

    const handleEditUserModalClose = (): void => {
        setOpenEditModal(false);
        setEditUserFormData({ user_id: '', name: '', roles: '' });
    };

    const handleEditUserSaveClick = (): void => {
        assignRoleAsync((auth0AccessToken as string), selectedRoleId, editUserFormData.user_id).then(async () => {
            await fetchUsers();
            setOpenEditModal(false);
            setEditUserFormData({ user_id: '', name: '', roles: '' });
        });
    };

    const handleAddUserSave = (): void => {
        const selectedRoles: any = roles.find((role: any) => role.name === addUserFormData.user_metadata.roles[0]);
        saveUserAsync(auth0AccessToken, addUserFormData).then((user: any) => {
            assignRoleAsync((auth0AccessToken as string), selectedRoles.id, user.user_id).then(() => {
                setTimeout(() => {
                    fetchUsers();
                }, 2000);
                setOpenAddModal(false);
                setAddUserFormData({
                    "email": "",
                    "name": "",
                    "password": "",
                    "user_metadata": {
                        "roles": []
                    },
                    "connection": "Username-Password-Authentication"
                });
            });
        });
    };
    const handleAddUserModalCancelClick = (): void => {
        setOpenAddModal(false);
        setAddUserFormData({
            "email": "",
            "name": "",
            "password": "",
            "user_metadata": {
                "roles": []
            },
            "connection": "Username-Password-Authentication"
        });
    };

    const handleSearchClick = (): void => {
        searchString && searchUsersWithRoles((auth0AccessToken as string), searchString).then((user) => {
            //@ts-ignore
            setUsers(user);
        });
    }
    const handleClearSearchClick = async (): Promise<void> => {
        await fetchUsers();
        setSearchString('');
    }
    return (
        <>
            <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                padding: '5px'
            }}>
                <Grid container item xs={12} justifyContent={"space-between"}>
                    <Grid container item xs={6}>
                        <TextField
                            fullWidth
                            id="standard-bare"
                            variant="outlined"
                            placeholder='Search user'
                            size="small"
                            value={searchString}
                            InputProps={{
                                endAdornment: (
                                    <>
                                        <IconButton onClick={() => handleSearchClick()}>
                                            <SearchOutlined onClick={() => handleSearchClick()} />
                                        </IconButton>
                                        {searchString && (
                                            <IconButton>
                                                <ClearIcon onClick={() => handleClearSearchClick()} />
                                            </IconButton>
                                        )}
                                    </>
                                ),
                            }}
                            onChange={(event) => setSearchString(event.target.value)}
                        />
                    </Grid>
                    <Button
                        variant="contained"
                        onClick={() => setOpenAddModal(true)}>
                        <AddIcon />{'Add User'}
                    </Button>
                </Grid>
            </div>
            <Box sx={{ height: '100%', width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 20,
                            },
                        },
                    }}
                    pageSizeOptions={[20]}
                    disableRowSelectionOnClick
                />
                <Modal
                    open={openEditModal}
                    onClose={handleEditUserModalClose}
                >
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        width: 300,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}>
                        <h2>{"Update User's Data"}</h2>
                        <TextField
                            label="Name"
                            name="name"
                            value={editUserFormData.name}
                            onChange={(event) => {
                                setEditUserFormData({ ...editUserFormData, name: event.target.value })
                            }}
                            fullWidth
                            margin="normal"
                        />
                        <FormControl sx={{ m: 1, minWidth: 120 }}>
                            <InputLabel >{'Select Role'}</InputLabel>
                            <Select
                                value={editUserFormData.roles}
                                onChange={(event) => {
                                    const role: any = roles.find((role: any) => role.name === event.target.value);
                                    setEditUserFormData({ ...editUserFormData, roles: role.name })
                                    setSelectedRoleId(role.id);
                                }}
                                label="Select Role">
                                {roles.map((role) => (
                                    // @ts-ignore
                                    <MenuItem key={role.id} value={role.name} id={role.id}>
                                        {/* @ts-ignore */}
                                        {role.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: '100%',
                                mt: 2,
                            }}
                        >
                            <Button variant="outlined" onClick={() => setOpenEditModal(false)}>
                                {'Cancel'}
                            </Button>
                            <Button variant="contained" onClick={handleEditUserSaveClick}>
                                {'Save'}
                            </Button>
                        </Box>
                    </Box>
                </Modal>
                <Modal
                    open={openAddModal}
                    onClose={() => setOpenAddModal(false)}
                >
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        width: 500,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}>
                        <Grid>
                            <h2>{"Add User"}</h2>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="Name"
                                    name="name"
                                    value={addUserFormData.name}
                                    onChange={(event) => {
                                        setAddUserFormData({ ...addUserFormData, name: event.target.value })
                                    }}
                                    fullWidth
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="Email"
                                    name="email"
                                    value={addUserFormData.email}
                                    onChange={(event) => {
                                        setAddUserFormData({ ...addUserFormData, email: event.target.value })
                                    }}
                                    fullWidth
                                    margin="normal"
                                    type="email"
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="Password"
                                    name="password"
                                    value={addUserFormData.password}
                                    onChange={(event) => {
                                        setAddUserFormData({ ...addUserFormData, password: event.target.value })
                                    }}
                                    fullWidth
                                    margin="normal"
                                    type='password'
                                /></Grid>
                            <Grid item xs={12} sm={4}>
                                <FormControl sx={{ m: 1, minWidth: 120 }}>
                                    <InputLabel >{'Select Role'}</InputLabel>
                                    <Select
                                        value={addUserFormData.user_metadata.roles[0]}
                                        onChange={(event) => {
                                            const role: any = roles.find((role: any) => role.name === event.target.value);
                                            //@ts-ignore
                                            setAddUserFormData({ ...addUserFormData, user_metadata: { ...addUserFormData.user_metadata, roles: [role.name] } })
                                            setSelectedRoleId(role.id);
                                        }}
                                        label="Select Role">
                                        {roles.map((role) => (
                                            // @ts-ignore
                                            <MenuItem key={role.id} value={role.name} id={role.id}>
                                                {/* @ts-ignore */}
                                                {role.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: '100%',
                                mt: 2,
                            }}
                        >
                            <Button variant="outlined" onClick={() => handleAddUserModalCancelClick()}>
                                {'Cancel'}
                            </Button>
                            <Button variant="contained" onClick={handleAddUserSave}>
                                {'Save'}
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            </ Box>
        </>
    );
};