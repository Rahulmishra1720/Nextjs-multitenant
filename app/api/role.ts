import management from "../_lib/auth0Management";; // Import your configured Auth0 Management client

export default async function handler(req: any, res: any) {
    try {
        const { name, description } = req.body;
        console.log(req.method)
        const users = await management.roles.create({
            name: name,
            description: description
        });
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        //@ts-ignore
        res.status(error.status || 500).json({ error: error.message });
    }
}