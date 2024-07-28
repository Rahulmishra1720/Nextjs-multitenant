'use client';
import * as React from 'react';
import { Box, Button, Grid, Modal, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import moment, { Moment } from 'moment';
import { supabase } from '../../../supabase';
import { UserContext, useUser } from '@auth0/nextjs-auth0/client';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { formattedDate } from '../../../_lib/util';

const Page = () => {
    const loggedInUserData: UserContext = useUser();
    const [isTaskModalOpen, setIsTaskModalOpen] = React.useState<boolean>(false);
    const [addTaskFormData, setAddTaskFormData] = React.useState<any>({
        user_id: "",
        task: "",
        task_description: "",
        assigned_to: "",
        assigned_date: null,
        expected_completed_date: null,
        completed_date: null,
        status: 'Todo'
    });
    const [tasks, setTasks] = React.useState<any[]>([]);
    React.useEffect(() => {
        async function fetchTasks() {
            const tasks = await supabase.from('task').select('*').eq('user_id', loggedInUserData.user?.sub);
            setTasks(tasks.data ? tasks.data : []);
        }
        fetchTasks();
    }, [])
    const handleSaveButtomClick = async (task: any) => {
        await supabase.from('task').insert([
            { ...task, user_id: loggedInUserData.user?.sub },
        ]);
        setIsTaskModalOpen(false);
        setAddTaskFormData({
            user_id: "",
            task: "",
            task_description: "",
            assigned_to: "",
            assigned_date: null,
            expected_completed_date: null,
            completed_date: null
        })
    };

    const columns: GridColDef<(typeof rows)[number]>[] = [
        {
            field: 'id',
            headerName: 'ID',
            width: 200,
        },
        {
            field: 'assigned_to',
            headerName: 'Assigned To',
            width: 200,
        },
        {
            field: 'task',
            headerName: 'task',
            width: 150,
        },
        {
            field: 'task_description',
            headerName: 'Task Description',
            width: 180,
        },
        {
            field: 'assigned_date',
            headerName: 'Assigned Date',
            width: 180
        },
    ];
    const rows = tasks.map(task => {
        //@ts-ignore
        return { id: task.id, task: task.task, task_description: task.task_description, assigned_to: task.assigned_to, assigned_date: formattedDate(task.assigned_date) }
    });
    return (
        <>
            <Grid container direction='row' justifyContent={"flex-end"} style={{ padding: "5px" }}>
                <Button
                    variant="contained"
                    onClick={() => setIsTaskModalOpen(true)}
                >
                    {'Assign Task'}
                </Button>
            </Grid>
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
                    open={isTaskModalOpen}
                    onClose={() => setIsTaskModalOpen(false)}
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
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}>
                        <Grid>
                            <h2>{"Assign Task"}</h2>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="Task"
                                    name="task"
                                    value={addTaskFormData.task}
                                    onChange={(event) => {
                                        setAddTaskFormData({ ...addTaskFormData, task: event.target.value });
                                    }}
                                    fullWidth
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="Description"
                                    name="task_description"
                                    value={addTaskFormData.task_description}
                                    onChange={(event) => {
                                        setAddTaskFormData({ ...addTaskFormData, task_description: event.target.value });
                                    }}
                                    fullWidth
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="Assigned To"
                                    name="assigned_to"
                                    value={addTaskFormData.assigned_to}
                                    onChange={(event) => {
                                        setAddTaskFormData({ ...addTaskFormData, assigned_to: event.target.value });
                                    }}
                                    fullWidth
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Assigned Date"
                                        value={addTaskFormData.assigned_date ? dayjs(addTaskFormData.assigned_date) : null}
                                        //@ts-ignore
                                        onChange={(date: Moment) => setAddTaskFormData({ ...addTaskFormData, assigned_date: moment(date).toDate() })}
                                        renderInput={(params: any) => <TextField {...params} fullWidth margin="normal" />}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Expected Completed Date"
                                        value={addTaskFormData.expected_completed_date ? dayjs(addTaskFormData.expected_completed_date) : null}
                                        //@ts-ignore
                                        onChange={(date: Moment) => setAddTaskFormData({ ...addTaskFormData, expected_completed_date: moment(date).toDate() })}
                                        renderInput={(params: any) => <TextField {...params} fullWidth margin="normal" />}
                                    />
                                </LocalizationProvider>
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
                            <Button variant="outlined" onClick={() => setIsTaskModalOpen(false)}>
                                {'Cancel'}
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => handleSaveButtomClick(addTaskFormData)}
                            >
                                {'Save'}
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            </Box>
        </>
    );
};

export default Page;
