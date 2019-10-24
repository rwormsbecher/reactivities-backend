import React, { useState, useEffect } from "react";
import axios from "axios";
import { List, Container } from "semantic-ui-react";
import { IActivity } from "../models/activity";
import NavBar from "../../features/nav/NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";

const App = () => {
    const [activities, setActivities] = useState<IActivity[]>([]);
    const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);

    const [editMode, setEditMode] = useState(false);

    const handleSelectActivity = (id: string) => {
        setSelectedActivity(activities.filter(activity => activity.id === id)[0]);
        setEditMode(false);
    };

    const handleOpenCreateForm = () => {
        setSelectedActivity(null);
        setEditMode(true);
    };

    const handleCreateActivity = (activity: IActivity) => {
        setActivities([...activities, activity]);
        setSelectedActivity(activity);
        setEditMode(false);
    };

    const handleEditActivity = (activity: IActivity) => {
        setActivities([...activities.filter(a => a.id !== activity.id), activity]);
        setSelectedActivity(activity);
        setEditMode(false);
    };

    const handleDeleteActivity = (id: string) => {
        setActivities([...activities.filter(a => a.id !== id)]);
    };

    useEffect(() => {
        axios.get<IActivity[]>("http://localhost:5000/api/activities").then(response => {
            let activities: IActivity[] = [];
            response.data.forEach(activity => {
                activity.date = activity.date.split(".")[0];
                activities.push(activity);
            });

            setActivities(activities);
        });
    }, []);

    return (
        <React.Fragment>
            <NavBar openCreateForm={handleOpenCreateForm} />
            <List>
                <Container style={{ marginTop: "7em" }}>
                    <ActivityDashboard
                        activities={activities}
                        selectActivity={handleSelectActivity}
                        selectedActivity={selectedActivity}
                        editMode={editMode}
                        setEditMode={setEditMode}
                        setSelectedActivity={setSelectedActivity}
                        createActivity={handleCreateActivity}
                        editActivity={handleEditActivity}
                        deleteActivity={handleDeleteActivity}
                    ></ActivityDashboard>
                </Container>
            </List>
        </React.Fragment>
    );
};

export default App;
