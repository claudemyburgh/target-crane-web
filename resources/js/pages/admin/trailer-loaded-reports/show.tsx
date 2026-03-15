import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    Download,
    FileSpreadsheet,
    Mail,
    MapPin,
    Pencil,
    Truck,
    X,
} from 'lucide-react';
import { toast } from 'sonner';
import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import Wrapper from '@/components/wrapper';
import AppLayout from '@/layouts/app-layout';
import trailerLoadedReportsRoutes from '@/routes/admin/trailer-loaded-reports';
import type { BreadcrumbItem } from '@/types';

const routes = trailerLoadedReportsRoutes as any;
const { edit, index } = routes;

type LoadItem = {
    fleet_number: string;
    registration_number: string;
    loaded: string;
    location: string;
    comment: string;
};

type User = {
    id: number;
    name: string;
    email: string;
};

type Report = {
    id: number;
    date: string;
    loads: LoadItem[];
    created_at: string;
};

interface Props {
    report: Report;
    users: User[];
}

export default function ShowTrailerLoadedReport({ report, users }: Props) {
    const [emailDialogOpen, setEmailDialogOpen] = React.useState(false);
    const [selectedUsers, setSelectedUsers] = React.useState<number[]>([]);
    const [sendingEmail, setSendingEmail] = React.useState(false);
    const [userSearch, setUserSearch] = React.useState('');

    React.useEffect(() => {
        if (!emailDialogOpen) {
            setUserSearch('');
            setSelectedUsers([]);
        }
    }, [emailDialogOpen]);

    const filteredUsers = React.useMemo(() => {
        if (!userSearch.trim()) return users;
        const search = userSearch.toLowerCase();
        return users.filter(
            (user) =>
                user.name.toLowerCase().includes(search) ||
                user.email.toLowerCase().includes(search),
        );
    }, [users, userSearch]);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin', href: '/' },
        { title: 'Trailer Loaded Reports', href: routes.index().url },
        {
            title: new Date(report.date).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            }),
            href: '#',
        },
    ];

    const loadedCount = report.loads.filter(
        (l) => l.loaded && l.loaded !== 'Empty',
    ).length;
    const emptyCount = report.loads.filter(
        (l) => !l.loaded || l.loaded === 'Empty',
    ).length;

    const handleUserToggle = (userId: number) => {
        setSelectedUsers((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId],
        );
    };

    const handleSendEmail = () => {
        if (selectedUsers.length === 0) return;

        setSendingEmail(true);
        router.post(
            `/admin/trailer-loaded-reports/${report.date}/email`,
            { user_ids: selectedUsers },
            {
                onSuccess: () => {
                    setSendingEmail(false);
                    setEmailDialogOpen(false);
                    setSelectedUsers([]);
                    toast.success(
                        `Report sent to ${selectedUsers.length} recipient(s)`,
                    );
                },
                onFinish: () => {
                    setSendingEmail(false);
                    setEmailDialogOpen(false);
                    setSelectedUsers([]);
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Trailer Loaded Report" />
            <Wrapper>
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">
                            Report -{' '}
                            {new Date(report.date).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                            })}
                        </h1>
                        <p className="text-muted-foreground">
                            {report.loads.length} trailer
                            {report.loads.length !== 1 ? 's' : ''} in report
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="secondary" size="sm">
                                    <Download className="mr-2 h-4 w-4" />
                                    Download
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={`/admin/trailer-loaded-reports/pdf/${report.date}`}
                                    >
                                        <Download className="mr-2 h-4 w-4" />
                                        Download PDF
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={`/admin/trailer-loaded-reports/${report.date}/excel`}
                                    >
                                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                                        Download Excel
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setEmailDialogOpen(true)}
                        >
                            <Mail className="mr-2 h-4 w-4" />
                            Email
                        </Button>
                        <Link
                            href={routes.edit({
                                trailerLoadedReport: report.date,
                            })}
                        >
                            <Button variant="secondary" size="sm">
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </Button>
                        </Link>
                        <Link href={routes.index()}>
                            <Button variant="secondary" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Trailers
                            </CardTitle>
                            <Truck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {report.loads.length}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Loaded
                            </CardTitle>
                            <Check className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {loadedCount}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Empty
                            </CardTitle>
                            <X className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {emptyCount}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Trailer Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Fleet #</TableHead>
                                    <TableHead>Registration</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Comment</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {report.loads.map((load, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">
                                            {load.fleet_number}
                                        </TableCell>
                                        <TableCell>
                                            {load.registration_number}
                                        </TableCell>
                                        <TableCell>
                                            {load.loaded &&
                                            load.loaded !== 'Empty' ? (
                                                <Badge variant="default">
                                                    <Check className="mr-1 h-3 w-3" />
                                                    {load.loaded}
                                                </Badge>
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    Empty
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {load.location ? (
                                                <div className="flex items-center gap-1 text-muted-foreground">
                                                    <MapPin className="h-3 w-3" />
                                                    {load.location}
                                                </div>
                                            ) : (
                                                '-'
                                            )}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {load.comment || '-'}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Dialog
                    open={emailDialogOpen}
                    onOpenChange={setEmailDialogOpen}
                >
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Email Report</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <p className="text-sm text-muted-foreground">
                                Select recipients to send this report to:
                            </p>
                            <Input
                                placeholder="Search contacts..."
                                value={userSearch}
                                onChange={(e) => setUserSearch(e.target.value)}
                                className="mb-2"
                            />
                            <div className="max-h-[250px] space-y-2 overflow-y-auto rounded-md border p-2">
                                {filteredUsers.length === 0 ? (
                                    <p className="p-4 text-center text-sm text-muted-foreground">
                                        No contacts found
                                    </p>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <div
                                            key={user.id}
                                            className="flex items-center gap-2 rounded-md p-2 hover:bg-muted"
                                        >
                                            <Checkbox
                                                id={`user-${user.id}`}
                                                checked={selectedUsers.includes(
                                                    user.id,
                                                )}
                                                onCheckedChange={() =>
                                                    handleUserToggle(user.id)
                                                }
                                            />
                                            <label
                                                htmlFor={`user-${user.id}`}
                                                className="flex flex-1 cursor-pointer flex-col"
                                            >
                                                <span className="text-sm font-medium">
                                                    {user.name}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {user.email}
                                                </span>
                                            </label>
                                        </div>
                                    ))
                                )}
                            </div>
                            <Button
                                className="w-full"
                                onClick={handleSendEmail}
                                disabled={
                                    selectedUsers.length === 0 || sendingEmail
                                }
                            >
                                {sendingEmail
                                    ? 'Sending...'
                                    : `Send to ${selectedUsers.length} recipient(s)`}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </Wrapper>
        </AppLayout>
    );
}
