import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Key, 
  Mail, 
  User, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Edit, 
  Lock, 
  Unlock, 
  Sparkles, 
  Tv, 
  ShoppingBag, 
  Share2, 
  Crown,
  Check,
  AlertCircle
} from 'lucide-react';

export default function TeamPermissionsManager({ currentUser, setCurrentUser, setActiveTab }) {
  // Invited Employees List State
  const [employees, setEmployees] = useState([
    {
      id: 'emp_1',
      name: 'Nguyễn Văn Nam',
      email: 'nam.nguyen@gmail.com',
      role: 'manager',
      roleName: 'Quản Lý Livestream',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      status: 'active',
      addedAt: '2026-07-20',
      permissions: {
        canBroadcast: true,
        canUploadFiles: true,
        canManageProducts: true,
        canConnectApi: true
      }
    },
    {
      id: 'emp_2',
      name: 'Trần Thị Mai',
      email: 'mai.tran@gmail.com',
      role: 'operator',
      roleName: 'Nhân Viên Vận Hành Live',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      status: 'active',
      addedAt: '2026-07-21',
      permissions: {
        canBroadcast: true,
        canUploadFiles: true,
        canManageProducts: false,
        canConnectApi: false
      }
    },
    {
      id: 'emp_3',
      name: 'Lê Hoàng Long',
      email: 'long.le@gmail.com',
      role: 'sales',
      roleName: 'Sale & CSKH Livestream',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      status: 'active',
      addedAt: '2026-07-22',
      permissions: {
        canBroadcast: false,
        canUploadFiles: false,
        canManageProducts: true,
        canConnectApi: false
      }
    }
  ]);

  // Form State for Adding New Employee
  const [newEmployeeName, setNewEmployeeName] = useState('');
  const [newEmployeeEmail, setNewEmployeeEmail] = useState('');
  const [newEmployeeRole, setNewEmployeeRole] = useState('operator');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Role Definitions
  const rolesList = [
    {
      id: 'manager',
      title: '👑 Quản Lý Livestream (Studio Manager)',
      desc: 'Quản lý toàn bộ bàn dựng, nạp video/avatar, khởi chạy livestream đa luồng & quản lý kho sản phẩm.',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      defaultPerms: { canBroadcast: true, canUploadFiles: true, canManageProducts: true, canConnectApi: true }
    },
    {
      id: 'operator',
      title: '🎬 Nhân Viên Vận Hành Live (Live Operator)',
      desc: 'Chạy kịch bản MC AI, nạp video bán hàng, bấm phát/dừng livestream theo lịch phân công.',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      defaultPerms: { canBroadcast: true, canUploadFiles: true, canManageProducts: false, canConnectApi: false }
    },
    {
      id: 'sales',
      title: '🛒 Sale & Chăm Sóc Khách Hàng (CS & Sales Rep)',
      desc: 'Ghim sản phẩm giỏ hàng, kích hoạt bảng điện Flash Sale, trả lời bình luận khán giả real-time.',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      defaultPerms: { canBroadcast: false, canUploadFiles: false, canManageProducts: true, canConnectApi: false }
    },
    {
      id: 'analyst',
      title: '👁️ Nhân Viên Xem Báo Cáo (Viewer / Analyst)',
      desc: 'Chỉ xem chỉ số lượt xem, biểu đồ doanh số và hiệu suất các phiên livestream.',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      defaultPerms: { canBroadcast: false, canUploadFiles: false, canManageProducts: false, canConnectApi: false }
    }
  ];

  // Add Employee Handler
  const handleAddEmployee = (e) => {
    e.preventDefault();
    if (!newEmployeeName.trim() || !newEmployeeEmail.trim()) {
      alert("Vui lòng nhập đầy đủ Tên và Gmail của nhân viên!");
      return;
    }

    if (!newEmployeeEmail.includes('@')) {
      alert("Vui lòng nhập địa chỉ Gmail hợp lệ!");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const selectedRoleObj = rolesList.find(r => r.id === newEmployeeRole) || rolesList[1];
      const newEmp = {
        id: `emp_${Date.now()}`,
        name: newEmployeeName.trim(),
        email: newEmployeeEmail.trim().toLowerCase(),
        role: newEmployeeRole,
        roleName: selectedRoleObj.title.split('(')[0].trim(),
        badgeColor: selectedRoleObj.badgeColor,
        status: 'active',
        addedAt: new Date().toISOString().split('T')[0],
        permissions: { ...selectedRoleObj.defaultPerms }
      };

      setEmployees([newEmp, ...employees]);
      setNewEmployeeName('');
      setNewEmployeeEmail('');
      setIsSubmitting(false);
      alert(`⚡ ĐÃ ỦY QUYỀN THÀNH CÔNG: Đã phân quyền cấp bậc "${newEmp.roleName}" cho nhân viên Gmail (${newEmp.email})!`);
    }, 800);
  };

  // Toggle Employee Permission
  const togglePermission = (empId, permKey) => {
    setEmployees(employees.map(emp => {
      if (emp.id === empId) {
        return {
          ...emp,
          permissions: {
            ...emp.permissions,
            [permKey]: !emp.permissions[permKey]
          }
        };
      }
      return emp;
    }));
  };

  // Toggle Employee Lock Status
  const toggleEmployeeStatus = (empId) => {
    setEmployees(employees.map(emp => {
      if (emp.id === empId) {
        const nextStatus = emp.status === 'active' ? 'locked' : 'active';
        return { ...emp, status: nextStatus };
      }
      return emp;
    }));
  };

  // Delete Employee
  const handleDeleteEmployee = (empId, empName) => {
    if (window.confirm(`Bạn có chắc chắn muốn thu hồi toàn bộ quyền của nhân viên ${empName}?`)) {
      setEmployees(employees.filter(emp => emp.id !== empId));
    }
  };

  // Simulate Logging In as Employee to Test Staff Role Access
  const handleSimulateEmployeeLogin = (emp) => {
    setCurrentUser({
      name: emp.name + ' (Nhân Viên)',
      email: emp.email,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      isAdmin: false,
      employeeRole: emp.role,
      permissions: emp.permissions
    });
    setActiveTab('broadcast');
    alert(`Đã đăng nhập mô phỏng bằng Gmail nhân viên: ${emp.email} (Quyền: ${emp.roleName})!`);
  };

  return (
    <div className="space-y-6 font-sans text-left">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-r from-purple-900/20 via-[#121218] to-red-900/20">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-black mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> HỆ THỐNG PHÂN QUYỀN NHÂN VIÊN DOANH NGHIỆP MULTI-STAFF
          </div>
          <h2 className="text-2xl font-black text-white">Quản Lý & Phân Quyền Nhân Viên Theo Gmail</h2>
          <p className="text-xs text-gray-400 mt-1">Chủ gói cước có thể ủy quyền cho nhân viên dùng Gmail riêng để đăng nhập vào bàn dựng Studio.</p>
        </div>

        {/* Subscription Buyer Badge */}
        <div className="p-3.5 rounded-2xl bg-black/60 border border-purple-500/40 space-y-1 text-xs">
          <div className="flex items-center gap-1.5 text-amber-400 font-black">
            <Crown className="w-4 h-4" />
            <span>TÀI KHOẢN MUA GÓI (WORKSPACE OWNER)</span>
          </div>
          <p className="font-mono text-white font-bold">{currentUser?.email || 'quocthiencr90@gmail.com'}</p>
          <span className="text-[10px] text-emerald-400 font-bold block">
            Gói Enterprise VIP 4K • Đã phân quyền {employees.length} nhân viên
          </span>
        </div>
      </div>

      {/* Main Grid: Left Add Employee Form, Right Staff List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Form Add / Invite Employee */}
        <div>
          <form onSubmit={handleAddEmployee} className="glass-panel p-6 rounded-3xl border border-white/15 space-y-4 bg-black/60">
            <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <UserPlus className="w-4 h-4 text-purple-400" />
              ỦY QUYỀN / MỜI NHÂN VIÊN MỚI
            </h3>

            {/* Input 1: Employee Name */}
            <div className="space-y-1 text-xs">
              <label className="font-bold text-gray-300 block">1. HỌ VÀ TÊN NHÂN VIÊN:</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={newEmployeeName}
                  onChange={(e) => setNewEmployeeName(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-white/15 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  placeholder="Ví dụ: Nguyễn Văn Nam..."
                  required
                />
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Input 2: Employee Gmail Address */}
            <div className="space-y-1 text-xs">
              <label className="font-bold text-gray-300 block">2. ĐỊA CHỈ GMAIL NHÂN VIÊN DÙNG ĐĂNG NHẬP:</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={newEmployeeEmail}
                  onChange={(e) => setNewEmployeeEmail(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-white/15 rounded-xl pl-9 pr-3 py-2.5 font-mono text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  placeholder="nam.nguyen@gmail.com..."
                  required
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Input 3: Tiered Role Selection */}
            <div className="space-y-2 text-xs">
              <label className="font-bold text-gray-300 block">3. CẤP BẬC QUẢN TRỊ / VAI TRÒ:</label>
              <div className="space-y-2">
                {rolesList.map((role) => (
                  <div
                    key={role.id}
                    onClick={() => setNewEmployeeRole(role.id)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                      newEmployeeRole === role.id
                        ? 'border-purple-500 bg-purple-500/20 shadow-glow-purple'
                        : 'border-white/10 bg-[#0A0A0A] hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{role.title}</span>
                      {newEmployeeRole === role.id && <Check className="w-4 h-4 text-purple-400" />}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">{role.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white font-black text-xs rounded-xl shadow-glow-purple hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isSubmitting ? 'ĐANG ỦY QUYỀN NHÂN VIÊN...' : '⚡ XÁC NHẬN MỜI NHÂN VIÊN QUA GMAIL'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Delegated Employees List Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4 bg-black/60">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                DANH SÁCH {employees.length} NHÂN VIÊN ĐÃ ĐƯỢC CẤP QUYỀN
              </h3>

              <span className="text-xs text-emerald-400 font-mono font-bold">
                ● TỰ ĐỘNG NHẬN DIỆN KHI ĐĂNG NHẬP GMAIL
              </span>
            </div>

            {employees.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400 space-y-2">
                <AlertCircle className="w-8 h-8 mx-auto text-gray-600" />
                <p>Chưa có nhân viên nào được thêm. Hãy nhập Gmail ở ô bên trái để phân quyền cho nhân viên!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {employees.map((emp) => (
                  <div
                    key={emp.id}
                    className={`glass-panel p-4 rounded-2xl border transition-all space-y-3 ${
                      emp.status === 'active' 
                        ? 'border-white/15 bg-[#121218]' 
                        : 'border-red-500/30 bg-red-950/20 opacity-60'
                    }`}
                  >
                    {/* Employee Info Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center font-black text-purple-300 text-sm">
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{emp.name}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${emp.badgeColor}`}>
                              {emp.roleName}
                            </span>
                          </div>
                          <p className="text-xs text-emerald-400 font-mono mt-0.5">{emp.email}</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSimulateEmployeeLogin(emp)}
                          className="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/40 text-xs font-bold transition-all cursor-pointer"
                          title="Thử đăng nhập dưới danh nghĩa nhân viên này"
                        >
                          🔑 Thử Đăng Nhập
                        </button>

                        <button
                          onClick={() => toggleEmployeeStatus(emp.id)}
                          className={`p-2 rounded-xl border transition-all cursor-pointer ${
                            emp.status === 'active'
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
                              : 'bg-red-500/20 text-red-400 border-red-500/40 hover:bg-red-500/30'
                          }`}
                          title={emp.status === 'active' ? "Khóa tạm thời" : "Mở khóa"}
                        >
                          {emp.status === 'active' ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                        </button>

                        <button
                          onClick={() => handleDeleteEmployee(emp.id, emp.name)}
                          className="p-2 rounded-xl bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/40 transition-all cursor-pointer"
                          title="Thu hồi toàn bộ quyền"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Permissions Toggle Checkboxes */}
                    <div className="pt-2 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                      <button
                        onClick={() => togglePermission(emp.id, 'canBroadcast')}
                        className={`p-2 rounded-xl border flex items-center justify-between font-bold cursor-pointer transition-all ${
                          emp.permissions.canBroadcast 
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' 
                            : 'bg-gray-800/40 border-gray-700 text-gray-500'
                        }`}
                      >
                        <span>📺 Bật Live Stream</span>
                        {emp.permissions.canBroadcast ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-gray-500" />}
                      </button>

                      <button
                        onClick={() => togglePermission(emp.id, 'canUploadFiles')}
                        className={`p-2 rounded-xl border flex items-center justify-between font-bold cursor-pointer transition-all ${
                          emp.permissions.canUploadFiles 
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' 
                            : 'bg-gray-800/40 border-gray-700 text-gray-500'
                        }`}
                      >
                        <span>📂 Nạp Video/Ảnh</span>
                        {emp.permissions.canUploadFiles ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-gray-500" />}
                      </button>

                      <button
                        onClick={() => togglePermission(emp.id, 'canManageProducts')}
                        className={`p-2 rounded-xl border flex items-center justify-between font-bold cursor-pointer transition-all ${
                          emp.permissions.canManageProducts 
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' 
                            : 'bg-gray-800/40 border-gray-700 text-gray-500'
                        }`}
                      >
                        <span>🛒 Ghim Sản Phẩm</span>
                        {emp.permissions.canManageProducts ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-gray-500" />}
                      </button>

                      <button
                        onClick={() => togglePermission(emp.id, 'canConnectApi')}
                        className={`p-2 rounded-xl border flex items-center justify-between font-bold cursor-pointer transition-all ${
                          emp.permissions.canConnectApi 
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' 
                            : 'bg-gray-800/40 border-gray-700 text-gray-500'
                        }`}
                      >
                        <span>🔑 Nhập Stream Key</span>
                        {emp.permissions.canConnectApi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-gray-500" />}
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
