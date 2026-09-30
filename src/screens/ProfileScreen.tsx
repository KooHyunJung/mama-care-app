import { useState, useCallback } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Switch, Modal, TextInput, Alert, Share, ActivityIndicator,
  KeyboardAvoidingView, Platform, Image,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

const ROLES = ["엄마", "아빠", "조부모", "기타"];
const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/thumbs/svg?seed=";

interface Profile {
  id: string; name: string; nickname?: string; email: string;
  role: string; avatar_url: string | null;
}
interface Child { id: string; name: string; type: string; date: string; }
interface FamilyGroup { id: string; invite_code: string; created_by: string; }
interface FamilyMember { id: string; user_id: string; profile?: Profile; }
interface SharingSettings {
  share_calendar: boolean; share_checklist: boolean; share_todos: boolean;
}

export default function ProfileScreen() {
  const { isLoggedIn, signOut } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [familyGroup, setFamilyGroup] = useState<FamilyGroup | null>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [sharing, setSharing] = useState<SharingSettings>({
    share_calendar: false, share_checklist: false, share_todos: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("엄마");
  const [editSaving, setEditSaving] = useState(false);

  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joinLoading, setJoinLoading] = useState(false);

  const [avatarLoading, setAvatarLoading] = useState(false);
  const [showInviteCode, setShowInviteCode] = useState(false);

  useFocusEffect(useCallback(() => {
    if (isLoggedIn) fetchAll();
  }, [isLoggedIn]));

  const fetchAll = async () => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setIsLoading(false); return; }

    const [{ data: prof }, { data: ch }, { data: mem }, { data: ss }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("children").select("*").eq("user_id", user.id).order("created_at"),
      supabase.from("family_members").select("family_group_id").eq("user_id", user.id).limit(1),
      supabase.from("sharing_settings").select("*").eq("user_id", user.id).single(),
    ]);

    setProfile(prof || null);
    setChildren(ch || []);
    if (ss) setSharing(ss);

    if (mem && mem.length > 0) {
      const groupId = mem[0].family_group_id;
      const [{ data: group }, { data: members }] = await Promise.all([
        supabase.from("family_groups").select("*").eq("id", groupId).single(),
        supabase.from("family_members").select("user_id").eq("family_group_id", groupId),
      ]);
      setFamilyGroup(group || null);

      if (members && members.length > 0) {
        const userIds = members.map((m: any) => m.user_id);
        const { data: memberProfiles } = await supabase
          .from("profiles").select("id, name, role, avatar_url, email").in("id", userIds);
        setFamilyMembers(members.map((m: any) => ({
          id: m.user_id,
          user_id: m.user_id,
          profile: memberProfiles?.find((p: any) => p.id === m.user_id),
        })));
      } else {
        setFamilyMembers([]);
      }
    } else {
      setFamilyGroup(null);
      setFamilyMembers([]);
    }

    setIsLoading(false);
  };

  const saveProfile = async () => {
    if (!editName.trim()) { Alert.alert("이름을 입력해주세요."); return; }
    setEditSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setEditSaving(false); return; }
    const { error } = await supabase.from("profiles").upsert({
      id: user.id, email: user.email ?? profile?.email, name: editName.trim(), role: editRole,
      updated_at: new Date().toISOString(),
    });
    if (error) {
      console.error("saveProfile upsert error:", error);
      Alert.alert("프로필을 저장하지 못했어요.", error.message);
      setEditSaving(false);
      return;
    }
    setProfile(prev => prev ? { ...prev, name: editName.trim(), role: editRole } : prev);
    setEditSaving(false);
    setShowEditModal(false);
  };

  const updateSharing = async (key: keyof SharingSettings, value: boolean) => {
    const next = { ...sharing, [key]: value };
    setSharing(next);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("sharing_settings").upsert({ user_id: user.id, ...next });
  };

  const createFamilyGroup = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      Alert.alert("로그인이 필요해요.");
      return;
    }
    const { data: group, error: groupError } = await supabase.from("family_groups")
      .insert({ created_by: user.id }).select().single();
    if (groupError || !group) {
      console.error("createFamilyGroup insert error:", groupError);
      Alert.alert("가족 그룹을 만들지 못했어요.", groupError?.message);
      return;
    }
    const { error: memberError } = await supabase.from("family_members")
      .insert({ family_group_id: group.id, user_id: user.id });
    if (memberError) {
      console.error("createFamilyGroup member insert error:", memberError);
      Alert.alert("가족 그룹은 만들었지만 멤버 등록에 실패했어요.", memberError.message);
      return;
    }
    setFamilyGroup(group);
    setFamilyMembers([{ id: user.id, user_id: user.id, profile: profile || undefined }]);
  };

  const joinFamilyGroup = async () => {
    if (!joinCode.trim()) return;
    setJoinLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setJoinLoading(false); return; }

    const { data: group } = await supabase.from("family_groups")
      .select("*").eq("invite_code", joinCode.trim().toUpperCase()).single();

    if (!group) {
      Alert.alert("유효하지 않은 초대 코드예요.");
      setJoinLoading(false);
      return;
    }

    const { error: memberError } = await supabase.from("family_members")
      .insert({ family_group_id: group.id, user_id: user.id });
    if (memberError && memberError.code !== "23505") {
      console.error("joinFamilyGroup member insert error:", memberError);
      Alert.alert("가족 그룹에 참여하지 못했어요.", memberError.message);
      setJoinLoading(false);
      return;
    }
    setJoinCode("");
    setShowJoinModal(false);
    setJoinLoading(false);
    fetchAll();
  };

  const shareInviteCode = async () => {
    if (!familyGroup) return;
    await Share.share({
      message: `mama-care 가족 초대 코드: ${familyGroup.invite_code}\n앱에서 프로필 → 가족 그룹 → 코드 입력으로 참여하세요!`,
    });
  };

  const pickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("사진 접근 권한이 필요해요."); return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true, aspect: [1, 1], quality: 0.7,
    });
    if (result.canceled) return;

    setAvatarLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setAvatarLoading(false); return; }

    const uri = result.assets[0].uri;
    const ext = uri.split(".").pop() || "jpg";
    const path = `${user.id}/avatar.${ext}`;

    const response = await fetch(uri);
    const blob = await response.blob();
    const arrayBuffer = await new Response(blob).arrayBuffer();

    const { error } = await supabase.storage.from("avatars").upload(path, arrayBuffer, {
      contentType: `image/${ext}`, upsert: true,
    });

    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
      const urlWithCache = `${publicUrl}?t=${Date.now()}`;
      await supabase.from("profiles").update({ avatar_url: urlWithCache }).eq("id", user.id);
      setProfile(prev => prev ? { ...prev, avatar_url: urlWithCache } : prev);
    }
    setAvatarLoading(false);
  };

  const handleLogout = () => {
    Alert.alert("로그아웃", "로그아웃 하시겠어요?", [
      { text: "취소", style: "cancel" },
      { text: "로그아웃", style: "destructive", onPress: () => signOut() },
    ]);
  };

  if (!isLoggedIn) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 40, marginBottom: 12 }}>👤</Text>
        <Text style={styles.emptyText}>로그인하면 프로필을 확인할 수 있어요</Text>
      </View>
    );
  }

  if (isLoading) {
    return <View style={styles.center}><ActivityIndicator color="#ec4899" size="large" /></View>;
  }

  const avatarUri = profile?.avatar_url || `${DEFAULT_AVATAR}${profile?.email || "default"}`;
  const displayName = profile?.name || profile?.nickname || profile?.email || "사용자";

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        {/* 프로필 헤더 */}
        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={pickAvatar} style={styles.avatarWrap} disabled={avatarLoading}>
            {avatarLoading
              ? <View style={[styles.avatar, styles.avatarLoading]}><ActivityIndicator color="#ec4899" /></View>
              : <Image source={{ uri: avatarUri }} style={styles.avatar} />
            }
            <View style={styles.avatarEditBadge}>
              <Text style={styles.avatarEditIcon}>✎</Text>
            </View>
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>{displayName}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>{profile?.role || "역할 미설정"}</Text>
            </View>
            <Text style={styles.profileEmail}>{profile?.email}</Text>
          </View>

          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => {
              setEditName(profile?.name || profile?.nickname || "");
              setEditRole(profile?.role || "엄마");
              setShowEditModal(true);
            }}
          >
            <Text style={styles.editBtnText}>수정</Text>
          </TouchableOpacity>
        </View>

        {/* 자녀 목록 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👶 자녀 목록</Text>
          {children.length === 0
            ? <Text style={styles.emptySection}>등록된 자녀가 없어요</Text>
            : children.map(child => (
              <View key={child.id} style={styles.childCard}>
                <Text style={styles.childName}>{child.name}</Text>
                <View style={[styles.typeBadge, { backgroundColor: child.type === "pregnancy" ? "#fff0f6" : "#f0fdf4" }]}>
                  <Text style={[styles.typeBadgeText, { color: child.type === "pregnancy" ? "#ec4899" : "#10b981" }]}>
                    {child.type === "pregnancy" ? "🤰 임신 중" : "👶 출생"}
                  </Text>
                </View>
                <Text style={styles.childDate}>{child.date}</Text>
              </View>
            ))
          }
        </View>

        {/* 가족 그룹 */}
        <View style={styles.section}>
          <View style={styles.familySectionHeader}>
            <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>👨‍👩‍👧 우리 가족</Text>
            {familyGroup && (
              <TouchableOpacity onPress={() => setShowInviteCode(v => !v)}>
                <Text style={styles.shareBtn}>초대하기 →</Text>
              </TouchableOpacity>
            )}
          </View>

          {!familyGroup ? (
            <View style={styles.familyEmpty}>
              <Text style={styles.emptySection}>가족과 함께 사용해보세요</Text>
              <View style={styles.familyBtns}>
                <TouchableOpacity style={styles.familyCreateBtn} onPress={createFamilyGroup}>
                  <Text style={styles.familyCreateText}>그룹 만들기</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.familyJoinBtn} onPress={() => setShowJoinModal(true)}>
                  <Text style={styles.familyJoinText}>코드로 참여</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              {showInviteCode && (
                <TouchableOpacity style={styles.inviteCodeBox} onPress={shareInviteCode}>
                  <View>
                    <Text style={styles.inviteLabel}>초대 코드</Text>
                    <Text style={styles.inviteCode}>{familyGroup.invite_code}</Text>
                  </View>
                  <Text style={styles.shareBtn}>공유하기</Text>
                </TouchableOpacity>
              )}

              <View style={styles.memberList}>
                {familyMembers.map(member => {
                  const p = member.profile;
                  const mAvatarUri = p?.avatar_url || `${DEFAULT_AVATAR}${p?.email || member.user_id}`;
                  return (
                    <View key={member.id} style={styles.memberItem}>
                      <Image source={{ uri: mAvatarUri }} style={styles.memberAvatar} />
                      <View>
                        <Text style={styles.memberName}>{p?.name || p?.email || "멤버"}</Text>
                        <Text style={styles.memberRole}>{p?.role || "-"}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </>
          )}
        </View>

        {/* 공유 설정 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📤 공유 설정</Text>
          <Text style={styles.sharingDesc}>가족 그룹원에게 내 데이터를 공유해요</Text>
          {[
            { key: "share_calendar" as const, label: "달력 공유" },
            { key: "share_checklist" as const, label: "체크리스트 공유" },
            { key: "share_todos" as const, label: "할일 공유" },
          ].map(item => (
            <View key={item.key} style={styles.switchRow}>
              <Text style={styles.switchLabel}>{item.label}</Text>
              <Switch
                value={sharing[item.key]}
                onValueChange={v => updateSharing(item.key, v)}
                trackColor={{ false: "#e5e7eb", true: "#fbcfe8" }}
                thumbColor={sharing[item.key] ? "#ec4899" : "#9ca3af"}
              />
            </View>
          ))}
        </View>

        {/* 로그아웃 */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>로그아웃</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* 프로필 수정 모달 */}
      <Modal visible={showEditModal} transparent animationType="slide">
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowEditModal(false)} />
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>프로필 수정</Text>

            <Text style={styles.modalLabel}>이름</Text>
            <TextInput
              style={styles.modalInput}
              value={editName}
              onChangeText={setEditName}
              placeholder="이름 입력"
              placeholderTextColor="#9ca3af"
              autoFocus
            />

            <Text style={styles.modalLabel}>역할</Text>
            <View style={styles.roleRow}>
              {ROLES.map(r => (
                <TouchableOpacity
                  key={r}
                  style={[styles.roleBtn, editRole === r && styles.roleBtnActive]}
                  onPress={() => setEditRole(r)}
                >
                  <Text style={[styles.roleBtnText, editRole === r && styles.roleBtnTextActive]}>{r}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowEditModal(false)}>
                <Text style={styles.cancelText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, editSaving && { opacity: 0.5 }]}
                onPress={saveProfile}
                disabled={editSaving}
              >
                <Text style={styles.saveText}>{editSaving ? "저장 중..." : "저장"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* 코드 참여 모달 */}
      <Modal visible={showJoinModal} transparent animationType="slide">
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowJoinModal(false)} />
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>코드로 가족 참여</Text>
            <TextInput
              style={[styles.modalInput, { textAlign: "center", fontSize: 20, letterSpacing: 4, fontWeight: "700" }]}
              value={joinCode}
              onChangeText={t => setJoinCode(t.toUpperCase())}
              placeholder="ABC123"
              placeholderTextColor="#9ca3af"
              autoCapitalize="characters"
              maxLength={6}
              autoFocus
            />
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => { setShowJoinModal(false); setJoinCode(""); }}>
                <Text style={styles.cancelText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, joinLoading && { opacity: 0.5 }]}
                onPress={joinFamilyGroup}
                disabled={joinLoading}
              >
                <Text style={styles.saveText}>{joinLoading ? "참여 중..." : "참여"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  content: { padding: 16 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyText: { fontSize: 14, color: "#9ca3af", textAlign: "center" },

  profileHeader: {
    flexDirection: "row", alignItems: "center", gap: 14,
    backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 16,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  avatarWrap: { position: "relative" },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#f3f4f6" },
  avatarLoading: { alignItems: "center", justifyContent: "center" },
  avatarEditBadge: {
    position: "absolute", bottom: 0, right: 0,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: "#ec4899", alignItems: "center", justifyContent: "center",
    borderWidth: 2, borderColor: "#fff",
  },
  avatarEditIcon: { fontSize: 10, color: "#fff" },
  profileName: { fontSize: 17, fontWeight: "700", color: "#111827" },
  roleBadge: { backgroundColor: "#fff0f6", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, marginTop: 4, alignSelf: "flex-start" },
  roleBadgeText: { fontSize: 11, color: "#ec4899", fontWeight: "600" },
  profileEmail: { fontSize: 11, color: "#9ca3af", marginTop: 4 },
  editBtn: { borderWidth: 1.5, borderColor: "#e5e7eb", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 },
  editBtnText: { fontSize: 12, fontWeight: "600", color: "#6b7280" },

  section: {
    backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 16,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: "#111827", marginBottom: 12 },
  familySectionHeader: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12,
  },
  emptySection: { fontSize: 13, color: "#9ca3af", marginBottom: 8 },

  childCard: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#f3f4f6" },
  childName: { fontSize: 14, fontWeight: "600", color: "#111827", flex: 1 },
  typeBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  typeBadgeText: { fontSize: 11, fontWeight: "600" },
  childDate: { fontSize: 11, color: "#9ca3af" },

  familyEmpty: { alignItems: "center", gap: 12 },
  familyBtns: { flexDirection: "row", gap: 10, width: "100%" },
  familyCreateBtn: { flex: 1, backgroundColor: "#ec4899", borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  familyCreateText: { fontSize: 13, fontWeight: "700", color: "#fff" },
  familyJoinBtn: { flex: 1, borderWidth: 1.5, borderColor: "#ec4899", borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  familyJoinText: { fontSize: 13, fontWeight: "700", color: "#ec4899" },

  inviteCodeBox: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: "#fff0f6", borderRadius: 12, padding: 14, marginBottom: 10,
  },
  inviteLabel: { fontSize: 11, color: "#9ca3af", marginBottom: 2 },
  inviteCode: { fontSize: 22, fontWeight: "800", color: "#ec4899", letterSpacing: 4 },
  shareBtn: { fontSize: 13, color: "#ec4899", fontWeight: "700" },

  memberList: { gap: 10 },
  memberItem: { flexDirection: "row", alignItems: "center", gap: 10 },
  memberAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#f3f4f6" },
  memberName: { fontSize: 13, fontWeight: "600", color: "#111827" },
  memberRole: { fontSize: 11, color: "#9ca3af" },

  sharingDesc: { fontSize: 12, color: "#9ca3af", marginBottom: 12, marginTop: -4 },
  switchRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#f3f4f6" },
  switchLabel: { fontSize: 14, color: "#374151" },

  logoutBtn: { borderWidth: 1.5, borderColor: "#e5e7eb", borderRadius: 12, paddingVertical: 14, alignItems: "center", marginBottom: 8 },
  logoutText: { fontSize: 14, fontWeight: "600", color: "#ef4444" },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  modalBox: { backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, gap: 12 },
  modalTitle: { fontSize: 16, fontWeight: "700", color: "#111827", textAlign: "center", marginBottom: 4 },
  modalLabel: { fontSize: 12, fontWeight: "600", color: "#6b7280" },
  modalInput: { borderWidth: 1.5, borderColor: "#e5e7eb", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: "#111827" },
  roleRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  roleBtn: { borderWidth: 1.5, borderColor: "#e5e7eb", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  roleBtnActive: { backgroundColor: "#ec4899", borderColor: "#ec4899" },
  roleBtnText: { fontSize: 13, color: "#6b7280", fontWeight: "600" },
  roleBtnTextActive: { color: "#fff" },
  modalBtns: { flexDirection: "row", gap: 10, marginTop: 4 },
  cancelBtn: { flex: 1, borderWidth: 1.5, borderColor: "#e5e7eb", borderRadius: 12, paddingVertical: 13, alignItems: "center" },
  cancelText: { fontSize: 14, fontWeight: "600", color: "#6b7280" },
  saveBtn: { flex: 1, backgroundColor: "#ec4899", borderRadius: 12, paddingVertical: 13, alignItems: "center" },
  saveText: { fontSize: 14, fontWeight: "700", color: "#fff" },
});
