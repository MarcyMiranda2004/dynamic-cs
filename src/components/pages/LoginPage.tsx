
const LoginPage = () => {
    return (
        <div className="fixed inset-0">
            <div>
                <div className="rounded-full size-150 bg-dcs-red blur-3xl absolute -top-35 -left-35 animate-spot-grow "/>
                <div className="rounded-full size-100 bg-purple-700 blur-3xl absolute -top-40 right-30"/>
                <div className="rounded-full size-100 bg-emerald-700 blur-3xl absolute bottom-0 -right-20"/>
                <div className="rounded-full size-90 bg-amber-700 blur-3xl absolute -bottom-30 left-15" />
            </div>

            <div className="fixed inset-0 z-40 bg-(--bg)/50" />
        </div>
    );
};
export default LoginPage;