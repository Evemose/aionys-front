import {useScopedI18n} from "@/config/locales/client";
import React, {useState} from "react";
import {patch} from "@/app/[locale]/_util/fetching";
import {
    Alert,
    Avatar,
    Backdrop,
    Button,
    IconButton,
    Input,
    InputLabel,
    Snackbar,
    Tooltip,
    Typography
} from "@mui/material";
import {Box} from "@mui/system";
import {CloudUpload} from "@mui/icons-material";
import {useUser} from "@/app/[locale]/@header/_userBar/logged-in";

export function ProfilePicture({profilePicture}: { profilePicture?: string }) {
    const [open, setOpen] = useState(false);
    return (
        <>
            <IconButton onClick={() => setOpen(true)}>
                {
                    profilePicture ?
                        <Avatar src={profilePicture} alt="Profile picture"/> :
                        <Avatar/>
                }
            </IconButton>
            <ProfilePictureBackdrop open={open} setOpen={setOpen}/>
        </>
    );
}

const toBase64 = (file: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});

interface ProfilePictureBackdropProps {
    open: boolean;
    setOpen: (value: boolean) => void;
}

const ProfilePictureBackdrop = ({open, setOpen}: ProfilePictureBackdropProps) => {
    const scopedT = useScopedI18n("uploadImage");
    const set = useUser(state => state.set);
    const [picture, setPicture] = useState<string | null>(null);
    const [moreThenOneFile, setMoreThenOneFile] = useState(false);

    const submitImage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const response = await patch("/me", {
            profilePicture: await toBase64(formData.get("profilePicture") as Blob)
        });

        if (!response.ok) {
            console.error(await response.json());
            return;
        }

        const user = await response.json();
        set(user);
        setOpen(false);
    };

    return (
        <Backdrop open={open} onClick={() => setOpen(false)}>
            <ProfilePictureForm
                scopedT={scopedT as (key: string) => string}
                picture={picture}
                setPicture={setPicture}
                submitImage={submitImage}
                setMoreThenOneFile={setMoreThenOneFile}
            />
            <Snackbar open={moreThenOneFile} onClose={() => setMoreThenOneFile(false)}>
                <Alert severity="error">{scopedT("onlyOneFileAllowed")}</Alert>
            </Snackbar>
        </Backdrop>
    );
};

interface ProfilePictureFormProps {
    scopedT: (key: string) => string;
    picture: string | null;
    setPicture: (value: string | null) => void;
    submitImage: (e: React.FormEvent<HTMLFormElement>) => void;
    setMoreThenOneFile: (value: boolean) => void;
}

const ProfilePictureForm = ({
                                scopedT,
                                picture,
                                setPicture,
                                submitImage,
                                setMoreThenOneFile
                            }: ProfilePictureFormProps) => (
    <Box
        component="form"
        onSubmit={submitImage}
        className="w-[50dvw] h-[50dvh] bg-white flex gap-4 flex-col rounded-3xl items-center pb-2 pt-6"
        onClick={e => e.stopPropagation()}
        method="POST"
    >
        <Typography variant="h5">{scopedT("changeProfilePicture")}</Typography>
        <ImageDropzone
            scopedT={scopedT}
            picture={picture}
            setPicture={setPicture}
            setMoreThenOneFile={setMoreThenOneFile}
        />
        <Button type="submit" variant="contained">{scopedT("submit")}</Button>
    </Box>
);

interface ImageDropzoneProps {
    scopedT: (key: string) => string;
    picture: string | null;
    setPicture: (value: string | null) => void;
    setMoreThenOneFile: (value: boolean) => void;
}

const ImageDropzone = ({
                           scopedT,
                           picture,
                           setPicture,
                           setMoreThenOneFile
                       }: ImageDropzoneProps) => (
    <Tooltip
        title={scopedT("uploadFile")}
        followCursor={true}
        PopperProps={{
            modifiers: [
                {
                    name: "offset",
                    options: {offset: [50, 0]}
                }
            ]
        }}
    >
        <Box
            className="w-4/5 h-full flex items-center justify-center border-black border-2 rounded-2xl"
            style={
                picture ? {
                    backgroundImage: `url(${picture})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                } : {}
            }
        >
            <InputLabel
                htmlFor="image-dropzone"
                className="w-full h-full flex items-center justify-center hover:cursor-pointer"
                onDrop={(e) => handleDrop(e, setPicture, setMoreThenOneFile)}
                onDragOver={(e) => e.preventDefault()}
            >
                <Box className="flex flex-col gap-2 bg-white bg-opacity-85 justify-center items-center rounded-3xl">
                    <CloudUpload fontSize="large"/>
                    <Typography variant="caption" className="w-4/5 text-wrap text-center">
                        {scopedT("dropImageHereOrClickToUploadFromFileSystem")}
                    </Typography>
                </Box>
            </InputLabel>
            <Input
                id="image-dropzone"
                type="file"
                name="profilePicture"
                className="opacity-0 w-0"
                onChange={(e) =>
                    handleChange(e as React.ChangeEvent<HTMLInputElement>, setPicture, setMoreThenOneFile)}
            />
        </Box>
    </Tooltip>
);

const handleDrop = (e: React.DragEvent, setPicture: (value: string | null) => void, setMoreThenOneFile: (value: boolean) => void) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 1) {
        setMoreThenOneFile(true);
        return;
    }
    for (const file of e.dataTransfer.files) {
        if (file.type.startsWith("image")) {
            setPicture(URL.createObjectURL(file));
        }
    }
};

const handleChange = (e: React.ChangeEvent<HTMLInputElement>, setPicture: (value: string | null) => void, setMoreThenOneFile: (value: boolean) => void) => {
    if (e.currentTarget.files && e.currentTarget.files.length > 1) {
        setMoreThenOneFile(true);
        return;
    }
    if (e.currentTarget.files && e.currentTarget.files[0]) {
        setPicture(URL.createObjectURL(e.currentTarget.files[0]));
    }
};

export default ProfilePictureBackdrop;