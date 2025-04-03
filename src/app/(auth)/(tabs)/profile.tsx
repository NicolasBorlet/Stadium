import { Button, Screen, Text } from "@/components"
import { useAuth } from "@/contexts/AuthContext"
import {
  useAcceptFriendRequest,
  useFriendRequests,
  useFriends,
  useRejectFriendRequest,
  useSendFriendRequest,
  useUserBadges,
} from "@/hooks/useFirestore"
import { BadgeData, FriendData } from "@/services/firestore"
import { spacing, ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"
import { observer } from "mobx-react-lite"
import { useState } from "react"
import { Image, ImageStyle, Modal, TextInput, TextStyle, View, ViewStyle } from "react-native"

export default observer(function ProfileScreen() {
  const { themed } = useAppTheme()
  const { user, signOut } = useAuth()
  const { data: badges } = useUserBadges()
  const { data: friends } = useFriends()
  const { data: friendRequests } = useFriendRequests()
  const sendFriendRequest = useSendFriendRequest()
  const acceptFriendRequest = useAcceptFriendRequest()
  const rejectFriendRequest = useRejectFriendRequest()

  const [isAddFriendModalVisible, setIsAddFriendModalVisible] = useState(false)
  const [friendCode, setFriendCode] = useState("")

  const handleSignOut = async () => {
    await signOut()
  }

  const handleAddFriend = async () => {
    if (friendCode.trim()) {
      await sendFriendRequest.mutateAsync(friendCode.trim())
      setFriendCode("")
      setIsAddFriendModalVisible(false)
    }
  }

  const handleAcceptRequest = async (requestId: string) => {
    await acceptFriendRequest.mutateAsync(requestId)
  }

  const handleRejectRequest = async (requestId: string) => {
    await rejectFriendRequest.mutateAsync(requestId)
  }

  return (
    <Screen safeAreaEdges={["top"]} contentContainerStyle={themed($container)} preset="scroll">
      <View style={themed($profileHeader)}>
        <View style={themed($avatarContainer)}>
          <Image
            source={require("../../../../assets/images/welcome-face.png")}
            style={themed($avatar)}
          />
        </View>
        <Text text={user?.name || "Utilisateur"} preset="heading" />
        <Text text={`Membre depuis ${user?.memberSince || "2024"}`} preset="default" />
      </View>

      <View
        style={{
          marginBottom: spacing.xl,
        }}
      >
        <Text text="Code ami" preset="subheading" style={themed($sectionTitleText)} />
        <View style={themed($friendCodeContainer)}>
          <Text text={user?.id || "Aucun"} preset="default" />
        </View>
        <Button
          text="Ajouter un ami"
          onPress={() => setIsAddFriendModalVisible(true)}
          style={{ marginTop: spacing.md }}
        />
      </View>

      <View style={themed($profileInfo)}>
        <View style={themed($infoItem)}>
          <Text text="Email" preset="default" />
          <Text text={user?.email || "user@example.com"} preset="default" />
        </View>
        <View style={themed($infoItem)}>
          <Text text="Pays" preset="default" />
          <Text text={user?.country || "France"} preset="default" />
        </View>
      </View>

      {/* Badges */}
      <View style={themed($section)}>
        <Text text="Badges" preset="subheading" style={themed($sectionTitleText)} />
        <View style={themed($badgesContainer)}>
          {badges?.map((badge: BadgeData) => (
            <View key={badge.id} style={themed($badgeItem)}>
              <Image source={{ uri: badge.image }} style={themed($badgeImage)} />
              <Text text={badge.name} preset="default" />
              <Text text={badge.description} preset="default" />
            </View>
          ))}
        </View>
      </View>

      {/* Amis */}
      <View style={themed($section)}>
        <Text text="Amis" preset="subheading" style={themed($sectionTitleText)} />
        <View style={themed($friendsContainer)}>
          {friends?.map((friend: FriendData) => (
            <View key={friend.id} style={themed($friendItem)}>
              <Text text={friend.name} preset="default" />
            </View>
          ))}
        </View>
      </View>

      {/* Demandes d'amis */}
      {friendRequests && friendRequests.length > 0 && (
        <View style={themed($section)}>
          <Text text="Demandes d'amis" preset="subheading" style={themed($sectionTitleText)} />
          <View style={themed($friendRequestsContainer)}>
            {friendRequests.map((request: FriendData) => (
              <View key={request.id} style={themed($friendRequestItem)}>
                <Text text={request.friendId} preset="default" />
                <View style={themed($friendRequestActions)}>
                  <Button
                    text="Accepter"
                    onPress={() => handleAcceptRequest(request.id)}
                    style={{ marginRight: spacing.sm }}
                  />
                  <Button text="Refuser" onPress={() => handleRejectRequest(request.id)} />
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={themed($actions)}>
        <Button text="Se déconnecter" onPress={handleSignOut} />
      </View>

      {/* Modal d'ajout d'ami */}
      <Modal
        visible={isAddFriendModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsAddFriendModalVisible(false)}
      >
        <View style={themed($modalOverlay)}>
          <View style={themed($modalContent)}>
            <Text text="Ajouter un ami" preset="heading" style={{ marginBottom: spacing.lg }} />
            <TextInput
              style={themed($input)}
              placeholder="Entrez le code ami"
              value={friendCode}
              onChangeText={setFriendCode}
              autoCapitalize="none"
            />
            <View style={themed($modalActions)}>
              <Button
                text="Annuler"
                onPress={() => setIsAddFriendModalVisible(false)}
                style={{ marginRight: spacing.sm }}
              />
              <Button text="Ajouter" onPress={handleAddFriend} />
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  )
})

const $container: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background,
  padding: spacing.lg,
})

const $profileHeader: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  marginBottom: spacing.xl,
})

const $avatarContainer: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 100,
  height: 100,
  borderRadius: 50,
  backgroundColor: colors.palette.neutral200,
  marginBottom: spacing.md,
  overflow: "hidden",
})

const $avatar: ThemedStyle<ImageStyle> = () => ({
  width: "100%",
  height: "100%",
})

const $profileInfo: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.md,
})

const $infoItem: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingVertical: spacing.sm,
})

const $section: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.xl,
})

const $sectionTitleText: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})

const $badgesContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  flexWrap: "wrap",
  gap: spacing.md,
})

const $badgeItem: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  width: "30%",
  alignItems: "center",
  padding: spacing.sm,
})

const $badgeImage: ThemedStyle<ImageStyle> = () => ({
  width: 50,
  height: 50,
  marginBottom: spacing.xs,
})

const $friendsContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.md,
})

const $friendItem: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.md,
  borderRadius: 8,
  backgroundColor: "rgba(0,0,0,0.05)",
})

const $friendRequestsContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.md,
})

const $friendRequestItem: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.md,
  borderRadius: 8,
  backgroundColor: "rgba(0,0,0,0.05)",
})

const $actions: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.xl,
  paddingTop: spacing.xl,
})

const $friendCodeContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.md,
  borderRadius: 8,
  backgroundColor: "rgba(0,0,0,0.05)",
  alignItems: "center",
})

const $friendRequestActions: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  marginTop: spacing.md,
})

const $modalOverlay: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  justifyContent: "center",
  alignItems: "center",
})

const $modalContent: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.background,
  padding: spacing.lg,
  borderRadius: 12,
  width: "80%",
})

const $modalActions: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "flex-end",
  marginTop: spacing.lg,
})

const $input: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: 8,
  padding: spacing.sm,
  marginBottom: spacing.md,
})
