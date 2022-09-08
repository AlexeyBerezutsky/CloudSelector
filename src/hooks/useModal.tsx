import { useState, createContext, useContext, PropsWithChildren } from 'react';
import { Box, Modal, Typography, Button } from '@mui/material';

// SOURCE https://opensource.com/article/21/5/global-modals-react

type ModalProps = {
    text: string;
    confirmation?: string;
    onHide?: () => void
} | null;

type ModalContext = {
    showModal: (modalProps: ModalProps) => void;
    hideModal: () => void;
    modalProps: ModalProps | null;
};

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function ModalDialog() {
    const { hideModal, modalProps } = useModal();
    const { text, confirmation } = modalProps || {};

    return (
        <Modal
            open={!!modalProps}
            onClose={() => hideModal()}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <>
                <Box sx={style}>
                    <Typography sx={{ mt: 2 }}>
                        {text}
                    </Typography>
                    <Button key={confirmation} onClick={() => hideModal()}>
                        {confirmation}
                    </Button>
                </Box>
            </>

        </Modal>
    );
};

const initalState: ModalContext = {
    showModal: () => { },
    hideModal: () => { },
    modalProps: null,
};

const Context = createContext(initalState);

export const ModalProvider = ({ children }: PropsWithChildren) => {
    const [modalProps, setModalProps] = useState<ModalProps>(null);

    const showModal = (modalProps: ModalProps) => {
        setModalProps(modalProps);
    };

    const hideModal = () => {
        setModalProps(null);
        modalProps?.onHide && modalProps?.onHide();
    };

    return (
        <Context.Provider value={{ modalProps, showModal, hideModal }}>
            {children}
            <ModalDialog />
        </Context.Provider>
    );
};

export const useModal = () => useContext(Context);